import { Component, HostListener, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  user: string | null = null;
  isAdmin: boolean = false;
  isOperador: boolean = false;
  cartCount: number = 3;
  isMenuOpen = false;
  isScrolled = false;

  private routerSub!: Subscription;

  constructor(private router: Router) {}

  private loadUser(): void {
    const saved = localStorage.getItem('user');
    const role = localStorage.getItem('role');
    this.user = saved ?? null;
    this.isAdmin = role === 'admin';
    this.isOperador = role === 'operador';
  }

  ngOnInit(): void {
    this.loadUser();
    this.routerSub = this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe(() => this.loadUser());
  }

  ngOnDestroy(): void {
    this.routerSub?.unsubscribe();
  }

  login(): void {
    this.router.navigate(['/login']);
  }

  logout(): void {
    localStorage.removeItem('user');
    localStorage.removeItem('role');
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
