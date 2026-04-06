import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  user: string | null = null;
  isAdmin: boolean = false;
  cartCount: number = 3;
  isMenuOpen = false;
  isScrolled = false;

  constructor(private router: Router) {}

  ngOnInit(): void {
    const saved = localStorage.getItem('user');
    if (saved) {
      this.user = saved;
      this.isAdmin = saved === 'admin';
    }
  }

  login(): void {
    this.router.navigate(['/login']);
  }

  logout(): void {
    localStorage.removeItem('user');
    this.user = null;
    this.isAdmin = false;
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
