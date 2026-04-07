import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ADMINISTRADORES, CLIENTES, OPERADORES } from '../../data/mock-data';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  usuario: string = '';
  contrasena: string = '';
  loginError: boolean = false;

  constructor(private router: Router, private authService: AuthService) {}

  onSubmit(): void {
    const admin = ADMINISTRADORES.find(
      a => a.usuario === this.usuario && a.contrasena === this.contrasena
    );

    if (admin) {
      this.authService.setUser(admin.usuario, 'admin');
      this.loginError = false;
      this.router.navigate(['/producto/menutabla']);
      return;
    }

    const operador = OPERADORES.find(
      o => o.usuario === this.usuario && o.contrasena === this.contrasena
    );

    if (operador) {
      this.authService.setUser(operador.usuario, 'operador');
      this.loginError = false;
      this.router.navigate(['/operador/inicio']);
      return;
    }

    const cliente = CLIENTES.find(
      c => c.username === this.usuario && c.password === this.contrasena
    );

    if (cliente) {
      this.authService.setUser(cliente.username, 'cliente');
      this.loginError = false;
      this.router.navigate(['/menu']);
      return;
    }

    this.loginError = true;
  }
}
