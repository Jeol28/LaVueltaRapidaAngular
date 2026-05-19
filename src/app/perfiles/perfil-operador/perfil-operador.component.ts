import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Operador } from '../../models/operador.model';
import { OperadorService } from '../../services/operador.service';

@Component({
  selector: 'app-perfil-operador',
  templateUrl: './perfil-operador.component.html',
  styleUrls: ['../perfil/perfil.component.css']
})
export class PerfilOperadorComponent implements OnInit {

  operador: Operador | null = null;
  editMode: boolean = false;
  editForm: Partial<Operador> = {};
  currentPassword: string = '';
  successMsg: boolean = false;
  errorMsg: string = '';

  showPassword: boolean = false;
  showCurrentPassword: boolean = false;

  constructor(
    private router: Router,
    private operadorService: OperadorService
  ) {}

  ngOnInit(): void {
    const role = localStorage.getItem('role');

    if (!localStorage.getItem('user') || role !== 'operador') {
      this.router.navigate(['/login']);
      return;
    }

    this.operadorService.getMe().subscribe({
      next: operador => {
        this.operador = operador;
      },
      error: () => {
        this.router.navigate(['/']);
      }
    });
  }

  get initial(): string {
    return this.operador?.nombre?.charAt(0).toUpperCase() ?? '?';
  }

  enterEditMode(): void {
    if (!this.operador) return;
    this.editForm = { ...this.operador };
    this.currentPassword = '';
    this.editMode = true;
    this.successMsg = false;
    this.errorMsg = '';
  }

  cancelEdit(): void {
    this.editMode = false;
    this.currentPassword = '';
    this.errorMsg = '';
  }

  saveChanges(): void {
    if (!this.operador) return;

    if (!this.currentPassword) {
      this.errorMsg = 'Debes ingresar tu contraseña actual.';
      return;
    }

    const payload: Partial<Operador> = { ...this.editForm };
    if (!payload.contrasena) {
      delete payload.contrasena;
    }
    payload.currentPassword = this.currentPassword;

    this.operadorService.update(this.operador!.id, payload).subscribe({
      next: updated => {
        this.operador = updated;
        localStorage.setItem('user', this.operador.usuario);
        window.dispatchEvent(new CustomEvent('userChanged'));
        this.editMode = false;
        this.currentPassword = '';
        this.successMsg = true;
        this.errorMsg = '';
        setTimeout(() => { this.successMsg = false; }, 4000);
      },
      error: err => {
        this.errorMsg = err?.error?.message
          ?? err?.error?.error
          ?? (typeof err?.error === 'string' ? err.error : null)
          ?? 'No se pudieron guardar los cambios. Intenta de nuevo.';
      }
    });
  }
}
