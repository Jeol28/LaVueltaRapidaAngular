import { Component } from '@angular/core';
import { Router } from '@angular/router';

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
    if (this.usuario === 'admin' && this.contrasena === 'admin') {
      localStorage.setItem('user', 'admin');
      this.loginError = false;
      this.router.navigate(['/producto/menutabla']);
    } else {
      this.loginError = true;
    }
  }
}
