import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Adicional } from '../models/adicional.model';
import { Comida } from '../models/comida.model';
import { ItemCarrito } from '../models/item-carrito.model';
import { CarritoBackend } from '../models/carrito-backend.model';

const API_URL = 'http://localhost:8090';

@Injectable({ providedIn: 'root' })
export class CarritoService {

  private items: ItemCarrito[] = [];
  private items$$ = new BehaviorSubject<ItemCarrito[]>([]);
  private carritoId: number | null = null;

  readonly items$: Observable<ItemCarrito[]> = this.items$$.asObservable();

  readonly count$: Observable<number> = this.items$.pipe(
    map(items => items.reduce((sum, i) => sum + i.cantidad, 0))
  );

  get total(): number {
    return this.items.reduce((sum, item) => {
      const extras = item.adicionales.reduce((s, a) => s + a.price, 0);
      return sum + (item.comida.price + extras) * item.cantidad;
    }, 0);
  }

  constructor(private http: HttpClient) {
    const clienteId = localStorage.getItem('clienteId');
    if (clienteId) {
      this.cargarDesdeBackend(+clienteId);
    }
  }

  iniciarSesion(clienteId: number): void {
    this.cargarDesdeBackend(clienteId);
  }

  cerrarSesion(): void {
    this.carritoId = null;
    this.items = [];
    this.items$$.next([]);
  }

  private get enModoBackend(): boolean {
    return !!localStorage.getItem('clienteId') && this.carritoId !== null;
  }

  private cargarDesdeBackend(clienteId: number): void {
    this.http.get<CarritoBackend>(`${API_URL}/carrito/cliente/${clienteId}`).subscribe({
      next: carrito => {
        this.carritoId = carrito.id;
        this.mapearLineas(carrito);
      },
      error: () => {}
    });
  }

  private recargar(): void {
    if (!this.carritoId) return;
    this.http.get<CarritoBackend>(`${API_URL}/carrito/${this.carritoId}`).subscribe({
      next: carrito => this.mapearLineas(carrito),
      error: () => {}
    });
  }

  private mapearLineas(carrito: CarritoBackend): void {
    this.items = carrito.lineas.map(l => ({
      lineaId: l.id,
      comida: l.comida,
      adicionales: (l.adicionales ?? []).map((a: any) => a.adicional ?? a),
      cantidad: l.cantidad
    }));
    this.items$$.next([...this.items]);
  }

  agregar(comida: Comida, adicionales: Adicional[]): void {
    if (this.enModoBackend) {
      this.http.post(
        `${API_URL}/carrito/${this.carritoId}/productos`,
        { comidaId: comida.id, cantidad: 1 }
      ).subscribe({ next: () => this.recargar(), error: () => {} });
    } else {
      const clave = this.buildKey(comida.id, adicionales);
      const existing = this.items.find(
        i => this.buildKey(i.comida.id, i.adicionales) === clave
      );
      if (existing) {
        existing.cantidad++;
      } else {
        this.items.push({ comida, adicionales: [...adicionales], cantidad: 1 });
      }
      this.items$$.next([...this.items]);
    }
  }

  cambiarCantidad(index: number, delta: number): void {
    const item = this.items[index];
    if (!item) return;

    if (this.enModoBackend && item.lineaId) {
      const endpoint = delta > 0 ? 'aumentar' : 'disminuir';
      this.http.patch(
        `${API_URL}/carrito/${this.carritoId}/productos/${item.lineaId}/${endpoint}`,
        {}
      ).subscribe({ next: () => this.recargar(), error: () => {} });
    } else {
      this.items[index].cantidad += delta;
      if (this.items[index].cantidad <= 0) {
        this.items.splice(index, 1);
      }
      this.items$$.next([...this.items]);
    }
  }

  eliminarLinea(lineaId: number): void {
    if (!this.enModoBackend) return;
    this.http.delete(
      `${API_URL}/carrito/${this.carritoId}/productos/${lineaId}`
    ).subscribe({ next: () => this.recargar(), error: () => {} });
  }

  vaciar(): void {
    if (this.enModoBackend) {
      this.http.delete(`${API_URL}/carrito/${this.carritoId}/vaciar`).subscribe({
        next: () => {
          this.items = [];
          this.items$$.next([]);
        },
        error: () => {}
      });
    } else {
      this.items = [];
      this.items$$.next([]);
    }
  }

  subtotalItem(item: ItemCarrito): number {
    const extras = item.adicionales.reduce((s, a) => s + a.price, 0);
    return (item.comida.price + extras) * item.cantidad;
  }

  private buildKey(comidaId: number, adicionales: Adicional[]): string {
    return `${comidaId}|${adicionales.map(a => a.id).sort().join(',')}`;
  }
}
