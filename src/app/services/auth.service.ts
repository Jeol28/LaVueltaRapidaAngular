import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ADMINISTRADORES } from '../data/mock-data';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _isAdmin = false;
  private _username: string | null = 'Jorge';

  constructor(private router: Router) {}

  get isAdmin(): boolean {
    return this._isAdmin;
  }

  get username(): string | null {
    return this._username;
  }

  login(usuario: string, contrasena: string): boolean {
    const admin = ADMINISTRADORES.find(
      a => a.usuario === usuario && a.contrasena === contrasena
    );
    if (admin) {
      this._isAdmin = true;
      this._username = admin.usuario;
      this.router.navigate(['/menu-admin']);
      return true;
    }
    return false;
  }

  loginDemo(): void {
    this._isAdmin = true;
    this._username = 'Admin';
    this.router.navigate(['/menu-admin']);
  }

  logout(): void {
    this._isAdmin = false;
    this._username = null;
    this.router.navigate(['/']);
  }
}
