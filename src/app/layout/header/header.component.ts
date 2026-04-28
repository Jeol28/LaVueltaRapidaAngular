import { Component, ElementRef, HostListener, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { CarritoService } from '../../services/carrito.service';
import { ItemCarrito } from '../../models/item-carrito.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  user: string | null = null;
  isAdmin: boolean = false;
  isOperador: boolean = false;
  cartCount: number = 0;
  cartItems: ItemCarrito[] = [];
  isMenuOpen = false;
  isScrolled = false;

  private routerSub!: Subscription;
  private cartSub!: Subscription;

  constructor(private router: Router, public carritoService: CarritoService, private el: ElementRef) {}

  private loadUser(): void {
    this.user = localStorage.getItem('user');
    const role = localStorage.getItem('role');
    this.isAdmin = role === 'admin';
    this.isOperador = role === 'operador';
  }

  @HostListener('window:userChanged')
  onUserChanged(): void {
    this.loadUser();
  }

  ngOnInit(): void {
    this.loadUser();
    this.routerSub = this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe(() => {
        this.loadUser();
        this.isMenuOpen = false;
      });
    this.cartSub = this.carritoService.items$.subscribe(items => {
      this.cartItems = items;
      this.cartCount = items.reduce((s, i) => s + i.cantidad, 0);
    });
  }

  ngOnDestroy(): void {
    this.routerSub?.unsubscribe();
    this.cartSub?.unsubscribe();
  }

  cambiarCantidad(index: number, delta: number): void {
    this.carritoService.cambiarCantidad(index, delta);
  }

  vaciarCarrito(): void {
    this.carritoService.vaciar();
  }

  irAProducto(item: ItemCarrito): void {
    const adicionalesIds = item.adicionales.map(a => a.id).join(',');
    const queryParams: Record<string, string | number> = { _r: Date.now() };
    if (adicionalesIds) queryParams['adicionales'] = adicionalesIds;
    this.router.navigate(['/producto', item.comida.id], { queryParams });
  }

  precioUnitario(item: ItemCarrito): number {
    return item.comida.price + item.adicionales.reduce((s, a) => s + a.price, 0);
  }

  formatCOP(amount: number): string {
    return new Intl.NumberFormat('es-CO').format(amount);
  }

  login(): void {
    this.router.navigate(['/login']);
  }

  logout(): void {
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    localStorage.removeItem('clienteId');
    localStorage.removeItem('carritoId');
    this.carritoService.vaciar();
    this.user = null;
    this.isAdmin = false;
    this.isOperador = false;
    this.router.navigate(['/']);
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    this.isScrolled = window.scrollY > 10;
  }

  @HostListener('window:resize', [])
  onWindowResize(): void {
    if (window.innerWidth >= 900) this.isMenuOpen = false;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (this.isMenuOpen && !this.el.nativeElement.contains(event.target)) {
      this.isMenuOpen = false;
    }
  }
}
