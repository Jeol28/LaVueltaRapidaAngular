import { Component, HostListener } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  cartCount: number = 3;
  isMenuOpen = false;
  isScrolled = false;

  constructor(public auth: AuthService) {}

  get user(): string | null {
    return this.auth.username;
  }

  get isAdmin(): boolean {
    return this.auth.isAdmin;
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 10;
  }

  login() {
    this.auth.loginDemo();
  }

  logout() {
    this.auth.logout();
  }
}
