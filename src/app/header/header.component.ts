import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  
  user: string | null = "Jorge"; // prueba
  isAdmin: boolean = false;

  ngOnInit() {
    this.isAdmin = this.user === 'Admin';
  }
  
  cartCount: number = 3; // cantidad de productos

  isMenuOpen = false;
  isScrolled = false;

  // Toggle menú móvil
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  // Detectar scroll (equivalente al window.addEventListener)
  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 10;
  }

  logout() {
  this.user = null;
  this.isAdmin = false;
}

}