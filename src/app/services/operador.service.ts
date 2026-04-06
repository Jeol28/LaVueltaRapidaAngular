import { Injectable } from '@angular/core';
import { Operador } from '../models/operador.model';
import { OPERADORES } from '../data/mock-data';

@Injectable({ providedIn: 'root' })
export class OperadorService {

  private operadores: Operador[] = OPERADORES.map(o => ({ ...o }));
  private nextId: number = Math.max(...OPERADORES.map(o => o.id)) + 1;

  getAll(): Operador[] {
    return this.operadores;
  }

  getById(id: number): Operador | undefined {
    return this.operadores.find(o => o.id === id);
  }

  add(data: { nombre: string; usuario: string; contrasena: string }): void {
    this.operadores.push({
      id: this.nextId++,
      nombre: data.nombre,
      usuario: data.usuario,
      contrasena: data.contrasena
    });
  }

  update(id: number, data: { nombre: string; usuario: string; contrasena: string }): void {
    const idx = this.operadores.findIndex(o => o.id === id);
    if (idx === -1) return;
    this.operadores[idx] = { ...this.operadores[idx], ...data };
  }

  delete(id: number): void {
    this.operadores = this.operadores.filter(o => o.id !== id);
  }
}
