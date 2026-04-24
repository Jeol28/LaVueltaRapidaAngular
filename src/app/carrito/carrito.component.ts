import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CarritoService } from '../services/carrito.service';
import { PedidoService } from '../services/pedido.service';
import { ItemCarrito } from '../models/item-carrito.model';

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css']
})
export class CarritoComponent implements OnInit, OnDestroy {

  items: ItemCarrito[] = [];
  private sub!: Subscription;

  pedidoCreado: boolean = false;
  pedidoId: number | null = null;
  cargando: boolean = false;
  errorMsg: string = '';

  constructor(
    public carritoService: CarritoService,
    private pedidoService: PedidoService,
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

  realizarPedido(): void {
    const carritoId = localStorage.getItem('carritoId');
    this.errorMsg = '';

    if (!carritoId) {
      this.errorMsg = 'No se encontró tu carrito. Por favor inicia sesión de nuevo.';
      return;
    }

    this.cargando = true;
    this.pedidoService.crearDesdeCarrito(+carritoId).subscribe({
      next: (pedido) => {
        this.cargando = false;
        this.pedidoId = pedido.id;
        this.pedidoCreado = true;
        this.carritoService.vaciar();
      },
      error: (err) => {
        this.cargando = false;
        const msg = err?.error?.error;
        this.errorMsg = msg ?? 'No se pudo crear el pedido. Intenta de nuevo.';
      }
    });
  }

  precioUnitario(item: ItemCarrito): number {
    return item.comida.price + item.adicionales.reduce((s, a) => s + a.price, 0);
  }

  formatCOP(amount: number): string {
    return new Intl.NumberFormat('es-CO').format(amount);
  }

  irAProducto(item: ItemCarrito): void {
    const adicionalesIds = item.adicionales.map(a => a.id).join(',');
    const queryParams: Record<string, string | number> = { _r: Date.now() };
    if (adicionalesIds) queryParams['adicionales'] = adicionalesIds;
    this.router.navigate(['/producto', item.comida.id], { queryParams });
  }

  volverAlMenu(): void {
    this.router.navigate(['/menu']);
  }

  verMisPedidos(): void {
    this.router.navigate(['/perfil'], {
      fragment: 'mis-pedidos',
      queryParams: { pedido: this.pedidoId }
    });
  }
}
