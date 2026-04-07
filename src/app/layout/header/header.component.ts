import { Component, HostListener, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { CarritoService } from '../../services/carrito.service';

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
  isMenuOpen = false;
  isScrolled = false;

  private routerSub!: Subscription;
  private cartSub!: Subscription;

  constructor(private router: Router, private carritoService: CarritoService) {}

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
      .subscribe(() => this.loadUser());
    this.cartSub = this.carritoService.count$.subscribe(c => {
      this.cartCount = c;
    });
  }

  ngOnDestroy(): void {
    this.routerSub?.unsubscribe();
    this.cartSub?.unsubscribe();
  }

  login(): void {
    this.router.navigate(['/login']);
  }

  logout(): void {
    localStorage.removeItem('user');
    localStorage.removeItem('role');
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
}
