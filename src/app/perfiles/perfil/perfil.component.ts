import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Cliente } from '../../models/cliente.model';
import { ClienteService } from '../../services/cliente.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {

  cliente: Cliente | null = null;
  editMode: boolean = false;
  editForm: Partial<Cliente> = {};
  currentPassword: string = '';
  successMsg: boolean = false;
  errorMsg: string = '';

  constructor(private router: Router, private clienteService: ClienteService) {}

  ngOnInit(): void {
    const username = localStorage.getItem('user');
    const role = localStorage.getItem('role');

    if (!username || role !== 'cliente') {
      this.router.navigate(['/login']);
      return;
    }

    this.clienteService.findByUsername(username).subscribe({
      next: cliente => {
        this.cliente = cliente ?? null;
        if (!this.cliente) {
          this.router.navigate(['/']);
        }
      },
      error: () => {
        this.router.navigate(['/']);
      }
    });
  }

  get initial(): string {
    return this.cliente?.name?.charAt(0).toUpperCase() ?? '?';
  }

  enterEditMode(): void {
    if (!this.cliente) return;
    this.editForm = { ...this.cliente };
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
    if (!this.cliente) return;

    if (this.currentPassword !== this.cliente.password) {
      this.errorMsg = 'La contraseña actual es incorrecta.';
      return;
    }

    this.clienteService.isUsernameTaken(this.editForm.username!, this.cliente.id).subscribe({
      next: taken => {
        if (taken) {
          this.errorMsg = 'Ese nombre de usuario ya está en uso.';
          return;
        }

        const payload: Partial<Cliente> = { ...this.editForm };
        if (!payload.password) {
          payload.password = this.cliente!.password;
        }

        this.clienteService.update(this.cliente!.id, payload).subscribe({
          next: updated => {
            this.cliente = updated;
            localStorage.setItem('user', this.cliente.username);
            window.dispatchEvent(new CustomEvent('userChanged'));

            this.editMode = false;
            this.currentPassword = '';
            this.successMsg = true;
            this.errorMsg = '';

            setTimeout(() => { this.successMsg = false; }, 4000);
          },
          error: () => {
            this.errorMsg = 'No se pudieron guardar los cambios. Intenta de nuevo.';
          }
        });
      },
      error: () => {
        this.errorMsg = 'No se pudo verificar el nombre de usuario.';
      }
    });
  }

  deleteAccount(): void {
    const confirmed = window.confirm(
      '¿Seguro que deseas eliminar tu cuenta? Esta acción no se puede deshacer.'
    );
    if (!confirmed || !this.cliente) return;

    this.clienteService.delete(this.cliente.id).subscribe({
      next: () => {
        localStorage.removeItem('user');
        localStorage.removeItem('role');
        this.router.navigate(['/']);
      },
      error: () => {
        this.errorMsg = 'No se pudo eliminar la cuenta. Intenta de nuevo.';
      }
    });
  }
}
