import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Adicional } from '../models/adicional.model';
import { Carrito } from '../models/carrito.model';
import { Comida } from '../models/comida.model';
import { ItemCarrito } from '../models/item-carrito.model';
import { LineaPedido } from '../models/linea-pedido.model';

const API_URL       = 'http://localhost:8090';
const STORAGE_KEY   = 'cv-carrito-items';

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

  // ── Carga inicial ──────────────────────────────────────────────────────────

  cargarDesdeBackend(): void {
    const carritoId = this.carritoId;
    if (!carritoId) {
      this.restaurarDesdeStorage();
      return;
    }

    this.http.get<Carrito>(`${API_URL}/carrito/${carritoId}`).subscribe({
      next: (carrito) => {
        const items = carrito.lineasPedido.map(lp => this.lineaToItem(lp));
        this.emitir(items);
        this.guardarEnStorage(items);
      },
      error: () => this.restaurarDesdeStorage()
    });
  }

  // ── Agregar ────────────────────────────────────────────────────────────────

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
      next: (carrito) => {
        const items = carrito.lineasPedido.map(lp => this.lineaToItem(lp));
        this.emitir(items);
        this.guardarEnStorage(items);
      },
      error: () => this.agregarLocal(comida, adicionales)
    });
  }

  // ── Cambiar cantidad ───────────────────────────────────────────────────────

  cambiarCantidad(index: number, delta: number): void {
    const item = this.items[index];
    if (!item) return;

    const carritoId = this.carritoId;
    if (!carritoId || !item.lineaId) {
      this.cambiarCantidadLocal(index, delta);
      return;
    }

    const endpoint = delta > 0 ? 'aumentar' : 'disminuir';
    this.http.patch<Carrito>(
      `${API_URL}/carrito/${carritoId}/productos/${item.lineaId}/${endpoint}`, {}
    ).subscribe({
      next: (carrito) => {
        const items = carrito.lineasPedido.map(lp => this.lineaToItem(lp));
        this.emitir(items);
        this.guardarEnStorage(items);
      },
      error: () => this.cambiarCantidadLocal(index, delta)
    });
  }

  // ── Vaciar ────────────────────────────────────────────────────────────────

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

  // ── Utils públicos ─────────────────────────────────────────────────────────

  subtotalItem(item: ItemCarrito): number {
    const extras = item.adicionales.reduce((s, a) => s + a.price, 0);
    return (item.comida.price + extras) * item.cantidad;
  }

  // ── Helpers privados ───────────────────────────────────────────────────────

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
    this.emitir([...this.items]);
    this.guardarEnStorage(this.items);
  }

  private cambiarCantidadLocal(index: number, delta: number): void {
    this.items[index].cantidad += delta;
    if (this.items[index].cantidad <= 0) this.items.splice(index, 1);
    this.emitir([...this.items]);
    this.guardarEnStorage(this.items);
  }

  private limpiarLocal(): void {
    this.emitir([]);
    localStorage.removeItem(STORAGE_KEY);
  }

  private emitir(items: ItemCarrito[]): void {
    this.items = items;
    this.items$$.next(items);
  }

  private guardarEnStorage(items: ItemCarrito[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch { }
  }

  private restaurarDesdeStorage(): void {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const items: ItemCarrito[] = JSON.parse(raw);
        this.emitir(items);
      }
    } catch { }
  }

  private buildKey(comidaId: number, adicionales: Adicional[]): string {
    return `${comidaId}|${adicionales.map(a => a.id).sort().join(',')}`;
  }
}
