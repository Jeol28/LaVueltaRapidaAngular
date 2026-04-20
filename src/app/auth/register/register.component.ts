import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ClienteService } from '../../services/cliente.service';
import { AuthService } from '../../services/auth.service';
import { CarritoService } from '../../services/carrito.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  form = {
    name: '',
    apellido: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    telefono: '',
    direccion: ''
  };

  errorMsg: string = '';
  passwordErrorMsg: string = '';

  constructor(
    private router: Router,
    private clienteService: ClienteService,
    private authService: AuthService,
    private carritoService: CarritoService
  ) {}

  checkPasswords(): void {
    if (this.form.confirmPassword && this.form.password !== this.form.confirmPassword) {
      this.passwordErrorMsg = 'Las contraseñas no coinciden.';
    } else {
      this.passwordErrorMsg = '';
    }
  }

  onSubmit(): void {
    this.errorMsg = '';

    if (this.form.password !== this.form.confirmPassword) {
      this.passwordErrorMsg = 'Las contraseñas no coinciden.';
      return;
    }

    this.clienteService.isUsernameTaken(this.form.username, -1).subscribe(taken => {
      if (taken) {
        this.errorMsg = 'Ese nombre de usuario ya está en uso. Por favor elige otro.';
        return;
      }

      this.clienteService.add({
        name: this.form.name,
        apellido: this.form.apellido,
        email: this.form.email,
        username: this.form.username,
        password: this.form.password,
        telefono: this.form.telefono,
        direccion: this.form.direccion
      }).subscribe(nuevo => {
        localStorage.setItem('user', nuevo.username);
        localStorage.setItem('role', 'cliente');
        localStorage.setItem('clienteId', String(nuevo.id));

        this.authService.fetchCarritoId(nuevo.id).subscribe(carritoId => {
          if (carritoId != null) {
            localStorage.setItem('carritoId', String(carritoId));
            this.carritoService.cargarDesdeBackend();
          }
          this.router.navigate(['/perfil']);
        });
      }, () => {
        this.errorMsg = 'No se pudo registrar. Intenta de nuevo.';
      });
    }, () => {
      this.errorMsg = 'No se pudo verificar el nombre de usuario. Intenta de nuevo.';
    });
  }
}
