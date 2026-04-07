import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Administrador } from '../../models/administrador.model';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-perfil-admin',
  templateUrl: './perfil-admin.component.html',
  styleUrls: ['../perfil/perfil.component.css']
})
export class PerfilAdminComponent implements OnInit {

  admin: Administrador | null = null;
  editMode: boolean = false;
  editForm: Partial<Administrador> = {};
  currentPassword: string = '';
  successMsg: boolean = false;
  errorMsg: string = '';

  constructor(private router: Router, private adminService: AdminService) {}

  ngOnInit(): void {
    const username = localStorage.getItem('user');
    const role = localStorage.getItem('role');

    if (!username || role !== 'admin') {
      this.router.navigate(['/login']);
      return;
    }

    this.admin = this.adminService.findByUsuario(username) ?? null;

    if (!this.admin) {
      this.router.navigate(['/']);
    }
  }

  get initial(): string {
    return this.admin?.usuario?.charAt(0).toUpperCase() ?? '?';
  }

  enterEditMode(): void {
    if (!this.admin) return;
    this.editForm = { ...this.admin };
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
    if (!this.admin) return;

    if (this.currentPassword !== this.admin.contrasena) {
      this.errorMsg = 'La contraseña actual es incorrecta.';
      return;
    }

    if (this.adminService.isUsernameTaken(this.editForm.usuario!, this.admin.id)) {
      this.errorMsg = 'Ese nombre de usuario ya está en uso.';
      return;
    }

    const updated = this.adminService.update(this.admin.id, this.editForm);
    if (!updated) return;

    this.admin = updated;
    localStorage.setItem('user', this.admin.usuario);
    window.dispatchEvent(new CustomEvent('userChanged'));

    this.editMode = false;
    this.currentPassword = '';
    this.successMsg = true;
    this.errorMsg = '';

    setTimeout(() => { this.successMsg = false; }, 4000);
  }
}
