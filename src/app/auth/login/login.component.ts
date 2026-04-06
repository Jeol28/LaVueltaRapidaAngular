import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  usuario: string = '';
  contrasena: string = '';
  loginError: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
    const ok = this.authService.login(this.usuario, this.contrasena);
    if (ok) {
      this.loginError = false;
      this.router.navigate(['/producto/menutabla']);
    } else {
      this.loginError = true;
    }
  }
}
