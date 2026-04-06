import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ADMINISTRADORES } from '../../data/mock-data';
import { CLIENTES } from '../../data/mock-data';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  usuario: string = '';
  contrasena: string = '';
  loginError: boolean = false;

  constructor(private router: Router) {}

  onSubmit(): void {
    const admin = ADMINISTRADORES.find(
      a => a.usuario === this.usuario && a.contrasena === this.contrasena
    );

    if (admin) {
      localStorage.setItem('user', admin.usuario);
      localStorage.setItem('role', 'admin');
      this.loginError = false;
      this.router.navigate(['/producto/menutabla']);
      return;
    }

    const cliente = CLIENTES.find(
      c => c.username === this.usuario && c.password === this.contrasena
    );

    if (cliente) {
      localStorage.setItem('user', cliente.username);
      localStorage.setItem('role', 'cliente');
      this.loginError = false;
      this.router.navigate(['/menu']);
      return;
    }

    this.loginError = true;
  }
}
