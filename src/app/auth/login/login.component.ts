import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CarritoService } from '../../services/carrito.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  usuario: string = '';
  contrasena: string = '';
  loginError: boolean = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private carritoService: CarritoService
  ) {}

  onSubmit(): void {
    this.loginError = false;

    this.authService.login(this.usuario, this.contrasena).subscribe({
      next: ({ username, role, clienteId, carritoId }) => {
        localStorage.setItem('user', username);
        localStorage.setItem('role', role);

        if (clienteId != null) {
          localStorage.setItem('clienteId', String(clienteId));
        }
        if (carritoId != null) {
          localStorage.setItem('carritoId', String(carritoId));
          this.carritoService.cargarDesdeBackend();
        }

        if (role === 'admin') {
          this.router.navigate(['/producto/menutabla']);
        } else if (role === 'operador') {
          this.router.navigate(['/operador/inicio']);
        } else {
          this.router.navigate(['/menu']);
        }
      },
      error: () => {
        this.loginError = true;
      }
    });
  }
}
