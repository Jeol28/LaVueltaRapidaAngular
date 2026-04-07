import { Component, HostListener, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';

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
  private userSub!: Subscription;

  constructor(private router: Router, private authService: AuthService) {}

  private loadRole(): void {
    const role = localStorage.getItem('role');
    this.isAdmin = role === 'admin';
    this.isOperador = role === 'operador';
  }

  ngOnInit(): void {
    this.loadRole();
    this.userSub = this.authService.user$.subscribe(u => {
      this.user = u;
    });
    this.routerSub = this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe(() => this.loadRole());
  }

  ngOnDestroy(): void {
    this.routerSub?.unsubscribe();
    this.userSub?.unsubscribe();
  }

  login(): void {
    this.router.navigate(['/login']);
  }

  logout(): void {
    this.authService.logout();
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
