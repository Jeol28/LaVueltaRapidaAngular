import { Injectable } from '@angular/core';
import { Administrador } from '../models/administrador.model';
import { ADMINISTRADORES, CLIENTES, OPERADORES } from '../data/mock-data';

@Injectable({ providedIn: 'root' })
export class AdminService {

  findByUsuario(usuario: string): Administrador | undefined {
    return ADMINISTRADORES.find(a => a.usuario === usuario);
  }

  isUsernameTaken(usuario: string, excludeId: number): boolean {
    return (
      ADMINISTRADORES.some(a => a.usuario === usuario && a.id !== excludeId) ||
      CLIENTES.some(c => c.username === usuario) ||
      OPERADORES.some(o => o.usuario === usuario)
    );
  }

  update(id: number, data: Partial<Administrador>): Administrador | null {
    const index = ADMINISTRADORES.findIndex(a => a.id === id);
    if (index === -1) return null;
    if (!data.contrasena) {
      data.contrasena = ADMINISTRADORES[index].contrasena;
    }
    ADMINISTRADORES[index] = { ...ADMINISTRADORES[index], ...data };
    return ADMINISTRADORES[index];
  }
}
