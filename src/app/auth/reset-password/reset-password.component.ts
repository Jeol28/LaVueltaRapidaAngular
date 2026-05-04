import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit, OnDestroy {
  token: string = '';
  password: string = '';
  confirmPassword: string = '';
  passwordErrorMsg: string = '';
  errorMsg: string = '';
  cargando: boolean = false;
  estado: 'formulario' | 'exito' = 'formulario';
  cuenta: number = 5;

  private countdownInterval: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParams['token'] ?? '';
    if (!this.token) {
      this.errorMsg = 'El enlace de recuperación no es válido. Solicita uno nuevo desde la página de login.';
    }
  }

  ngOnDestroy(): void {
    clearInterval(this.countdownInterval);
  }

  checkPasswords(): void {
    if (this.confirmPassword && this.password !== this.confirmPassword) {
      this.passwordErrorMsg = 'Las contraseñas no coinciden.';
    } else {
      this.passwordErrorMsg = '';
    }
  }

  onSubmit(): void {
    if (this.password !== this.confirmPassword) {
      this.passwordErrorMsg = 'Las contraseñas no coinciden.';
      return;
    }
    if (!this.token) return;

    this.errorMsg = '';
    this.cargando = true;

    this.authService.resetContrasena(this.token, this.password).subscribe({
      next: () => {
        this.cargando = false;
        this.estado = 'exito';
        this.iniciarCuentaRegresiva();
      },
      error: err => {
        this.cargando = false;
        this.errorMsg = err?.error?.message
          ?? err?.error?.error
          ?? 'El enlace expiró o no es válido. Solicita uno nuevo desde la página de login.';
      }
    });
  }

  private iniciarCuentaRegresiva(): void {
    this.countdownInterval = setInterval(() => {
      this.cuenta--;
      if (this.cuenta <= 0) {
        clearInterval(this.countdownInterval);
        this.router.navigate(['/login']);
      }
    }, 1000);
  }
}
