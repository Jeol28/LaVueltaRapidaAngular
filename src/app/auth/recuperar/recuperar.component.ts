import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-recuperar',
  templateUrl: './recuperar.component.html',
  styleUrls: ['./recuperar.component.css']
})
export class RecuperarComponent {
  email: string = '';
  estado: 'formulario' | 'cargando' | 'enviado' = 'formulario';
  errorMsg: string = '';

  constructor(private authService: AuthService) {}

  onSubmit(): void {
    this.errorMsg = '';
    this.estado = 'cargando';

    this.authService.solicitarRecuperacion(this.email).subscribe({
      next: () => {
        this.estado = 'enviado';
      },
      error: err => {
        this.estado = 'formulario';
        this.errorMsg = err?.error?.message
          ?? err?.error?.error
          ?? 'No pudimos procesar tu solicitud. Intenta de nuevo.';
      }
    });
  }
}
