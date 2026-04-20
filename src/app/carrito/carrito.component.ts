import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CarritoService } from '../services/carrito.service';
import { ItemCarrito } from '../models/item-carrito.model';

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css']
})
export class CarritoComponent implements OnInit, OnDestroy {

  items: ItemCarrito[] = [];
  private sub!: Subscription;

  constructor(
    public carritoService: CarritoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (!localStorage.getItem('user')) {
      this.router.navigate(['/login']);
      return;
    }
    this.sub = this.carritoService.items$.subscribe(items => {
      this.items = items;
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  cambiarCantidad(index: number, delta: number): void {
    this.carritoService.cambiarCantidad(index, delta);
  }

  vaciar(): void {
    this.carritoService.vaciar();
  }

  precioUnitario(item: ItemCarrito): number {
    return item.comida.price + item.adicionales.reduce((s, a) => s + a.price, 0);
  }

  formatCOP(amount: number): string {
    return new Intl.NumberFormat('es-CO').format(amount);
  }

  volverAlMenu(): void {
    this.router.navigate(['/menu']);
  }
}
