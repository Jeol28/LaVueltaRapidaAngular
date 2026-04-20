import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Adicional } from '../models/adicional.model';
import { Carrito } from '../models/carrito.model';
import { Comida } from '../models/comida.model';
import { ItemCarrito } from '../models/item-carrito.model';
import { LineaPedido } from '../models/linea-pedido.model';

const API_URL = 'http://localhost:8090';

@Injectable({ providedIn: 'root' })
export class CarritoService {

  private items: ItemCarrito[] = [];
  private items$$ = new BehaviorSubject<ItemCarrito[]>([]);

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
    this.cargarDesdeBackend();
  }

  private get carritoId(): number | null {
    const id = localStorage.getItem('carritoId');
    return id ? +id : null;
  }

  cargarDesdeBackend(): void {
    const carritoId = this.carritoId;
    if (!carritoId) return;

    this.http.get<Carrito>(`${API_URL}/carrito/${carritoId}`).subscribe({
      next: (carrito) => this.sincronizarDesde(carrito),
      error: () => {}
    });
  }

  agregar(comida: Comida, adicionales: Adicional[]): void {
    const carritoId = this.carritoId;
    if (!carritoId) {
      this.agregarLocal(comida, adicionales);
      return;
    }

    this.http.post<Carrito>(`${API_URL}/carrito/${carritoId}/productos`, {
      comidaId: comida.id,
      cantidad: 1,
      adicionalesIds: adicionales.map(a => a.id)
    }).subscribe({
      next: (carrito) => this.sincronizarDesde(carrito),
      error: () => this.agregarLocal(comida, adicionales)
    });
  }

  cambiarCantidad(index: number, delta: number): void {
    const item = this.items[index];
    if (!item) return;

    const carritoId = this.carritoId;
    if (!carritoId || !item.lineaId) {
      item.cantidad += delta;
      if (item.cantidad <= 0) this.items.splice(index, 1);
      this.items$$.next([...this.items]);
      return;
    }

    const endpoint = delta > 0 ? 'aumentar' : 'disminuir';
    this.http.patch<Carrito>(
      `${API_URL}/carrito/${carritoId}/productos/${item.lineaId}/${endpoint}`, {}
    ).subscribe({
      next: (carrito) => this.sincronizarDesde(carrito),
      error: () => {
        item.cantidad += delta;
        if (item.cantidad <= 0) this.items.splice(index, 1);
        this.items$$.next([...this.items]);
      }
    });
  }

  vaciar(): void {
    const carritoId = this.carritoId;
    if (!carritoId) {
      this.limpiarLocal();
      return;
    }

    this.http.delete<Carrito>(`${API_URL}/carrito/${carritoId}/vaciar`).subscribe({
      next: () => this.limpiarLocal(),
      error: () => this.limpiarLocal()
    });
  }

  subtotalItem(item: ItemCarrito): number {
    const extras = item.adicionales.reduce((s, a) => s + a.price, 0);
    return (item.comida.price + extras) * item.cantidad;
  }

  private sincronizarDesde(carrito: Carrito): void {
    this.items = carrito.lineasPedido.map(lp => this.lineaToItem(lp));
    this.items$$.next([...this.items]);
  }

  private lineaToItem(lp: LineaPedido): ItemCarrito {
    return {
      lineaId: lp.id,
      comida: lp.comida,
      adicionales: (lp.adicionales ?? []).map(lpa => lpa.adicional),
      cantidad: lp.cantidad
    };
  }

  private agregarLocal(comida: Comida, adicionales: Adicional[]): void {
    const clave = this.buildKey(comida.id, adicionales);
    const existing = this.items.find(i => this.buildKey(i.comida.id, i.adicionales) === clave);
    if (existing) {
      existing.cantidad++;
    } else {
      this.items.push({ comida, adicionales: [...adicionales], cantidad: 1 });
    }
    this.items$$.next([...this.items]);
  }

  private limpiarLocal(): void {
    this.items = [];
    this.items$$.next([]);
  }

  private buildKey(comidaId: number, adicionales: Adicional[]): string {
    return `${comidaId}|${adicionales.map(a => a.id).sort().join(',')}`;
  }
}
