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

  private readonly MOCK_CREDENTIALS = { usuario: 'jorge', contrasena: 'admin123' };

  constructor(private router: Router) {}

  onSubmit(): void {
    if (
      this.usuario === this.MOCK_CREDENTIALS.usuario &&
      this.contrasena === this.MOCK_CREDENTIALS.contrasena
    ) {
      this.loginError = false;
      this.router.navigate(['/producto/menutabla']);
    } else {
      this.loginError = true;
    }
  }
}
