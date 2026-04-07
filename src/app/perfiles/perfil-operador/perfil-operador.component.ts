import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Operador } from '../../models/operador.model';
import { OPERADORES } from '../../data/mock-data';

@Component({
  selector: 'app-perfil-operador',
  templateUrl: './perfil-operador.component.html',
  styleUrls: ['../perfil/perfil.component.css']
})
export class PerfilOperadorComponent implements OnInit {

  operador: Operador | null = null;
  editMode: boolean = false;
  editForm: Partial<Operador> = {};
  successMsg: boolean = false;
  errorMsg: string = '';

  constructor(private router: Router) {}

  ngOnInit(): void {
    const username = localStorage.getItem('user');
    const role = localStorage.getItem('role');

    if (!username || role !== 'operador') {
      this.router.navigate(['/login']);
      return;
    }

    this.operador = OPERADORES.find(o => o.usuario === username) ?? null;

    if (!this.operador) {
      this.router.navigate(['/']);
    }
  }

  get initial(): string {
    return this.operador?.nombre?.charAt(0).toUpperCase() ?? '?';
  }

  enterEditMode(): void {
    if (!this.operador) return;
    this.editForm = { ...this.operador };
    this.editMode = true;
    this.successMsg = false;
    this.errorMsg = '';
  }

  cancelEdit(): void {
    this.editMode = false;
    this.errorMsg = '';
  }

  saveChanges(): void {
    if (!this.operador) return;

    const index = OPERADORES.findIndex(o => o.id === this.operador!.id);
    if (index === -1) return;

    OPERADORES[index] = { ...OPERADORES[index], ...this.editForm } as Operador;
    this.operador = OPERADORES[index];

    localStorage.setItem('user', this.operador.usuario);

    this.editMode = false;
    this.successMsg = true;
    this.errorMsg = '';

    setTimeout(() => { this.successMsg = false; }, 4000);
  }
}
