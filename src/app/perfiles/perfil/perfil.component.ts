import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Cliente } from '../../models/cliente.model';
import { CLIENTES } from '../../data/mock-data';

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

  constructor(private router: Router) {}

  ngOnInit(): void {
    const username = localStorage.getItem('user');
    const role = localStorage.getItem('role');

    if (!username || role !== 'cliente') {
      this.router.navigate(['/login']);
      return;
    }

    this.cliente = CLIENTES.find(c => c.username === username) ?? null;

    if (!this.cliente) {
      this.router.navigate(['/']);
    }
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

    const index = CLIENTES.findIndex(c => c.id === this.cliente!.id);
    if (index === -1) return;

    if (!this.editForm.password) {
      this.editForm.password = this.cliente.password;
    }

    CLIENTES[index] = { ...CLIENTES[index], ...this.editForm } as Cliente;
    this.cliente = CLIENTES[index];

    localStorage.setItem('user', this.cliente.username);

    this.editMode = false;
    this.currentPassword = '';
    this.successMsg = true;
    this.errorMsg = '';

    setTimeout(() => { this.successMsg = false; }, 4000);
  }

  deleteAccount(): void {
    const confirmed = window.confirm(
      '¿Seguro que deseas eliminar tu cuenta? Esta acción no se puede deshacer.'
    );
    if (!confirmed) return;

    const index = CLIENTES.findIndex(c => c.id === this.cliente!.id);
    if (index !== -1) {
      CLIENTES.splice(index, 1);
    }

    localStorage.removeItem('user');
    localStorage.removeItem('role');
    this.router.navigate(['/']);
  }
}
