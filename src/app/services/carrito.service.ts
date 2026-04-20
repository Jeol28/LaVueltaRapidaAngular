import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Adicional } from '../models/adicional.model';
import { Comida } from '../models/comida.model';
import { ItemCarrito } from '../models/item-carrito.model';

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

  agregar(comida: Comida, adicionales: Adicional[]): void {
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

  cambiarCantidad(index: number, delta: number): void {
    if (index < 0 || index >= this.items.length) return;
    this.items[index].cantidad += delta;
    if (this.items[index].cantidad <= 0) {
      this.items.splice(index, 1);
    }
    this.items$$.next([...this.items]);
  }

  vaciar(): void {
    this.items = [];
    this.items$$.next([]);
  }

  subtotalItem(item: ItemCarrito): number {
    const extras = item.adicionales.reduce((s, a) => s + a.price, 0);
    return (item.comida.price + extras) * item.cantidad;
  }

  private buildKey(comidaId: number, adicionales: Adicional[]): string {
    return `${comidaId}|${adicionales.map(a => a.id).sort().join(',')}`;
  }
}
