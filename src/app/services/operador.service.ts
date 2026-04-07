import { Injectable } from '@angular/core';
import { Operador } from '../models/operador.model';
import { OPERADORES } from '../data/mock-data';

@Injectable({ providedIn: 'root' })
export class OperadorService {

  getAll(): Operador[] {
    return OPERADORES;
  }

  getById(id: number): Operador | undefined {
    return OPERADORES.find(o => o.id === id);
  }

  add(data: { nombre: string; usuario: string; contrasena: string }): void {
    const newId = OPERADORES.length > 0 ? Math.max(...OPERADORES.map(o => o.id)) + 1 : 1;
    OPERADORES.push({ id: newId, ...data });
  }

  update(id: number, data: { nombre: string; usuario: string; contrasena: string }): void {
    const index = OPERADORES.findIndex(o => o.id === id);
    if (index !== -1) OPERADORES[index] = { ...OPERADORES[index], ...data };
  }

  delete(id: number): void {
    const index = OPERADORES.findIndex(o => o.id === id);
    if (index !== -1) OPERADORES.splice(index, 1);
  }
}
