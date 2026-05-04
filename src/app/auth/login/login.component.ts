import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
  returnUrl: string = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private carritoService: CarritoService
  ) {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] ?? '';
  }

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
          this.router.navigate(['/admin/comidas']);
        } else if (role === 'operador') {
          this.router.navigate(['/operador/inicio']);
        } else {
          this.router.navigateByUrl(this.returnUrl || '/menu');
        }
      },
      error: () => {
        this.loginError = true;
      }
    });
  }
}
