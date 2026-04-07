import { Injectable } from '@angular/core';
import { Cliente } from '../models/cliente.model';
import { ADMINISTRADORES, CLIENTES, OPERADORES } from '../data/mock-data';

@Injectable({ providedIn: 'root' })
export class ClienteService {

  findByUsername(username: string): Cliente | undefined {
    return CLIENTES.find(c => c.username === username);
  }

  isUsernameTaken(username: string, excludeId: number): boolean {
    return (
      CLIENTES.some(c => c.username === username && c.id !== excludeId) ||
      OPERADORES.some(o => o.usuario === username) ||
      ADMINISTRADORES.some(a => a.usuario === username)
    );
  }

  update(id: number, data: Partial<Cliente>): Cliente | null {
    const index = CLIENTES.findIndex(c => c.id === id);
    if (index === -1) return null;
    if (!data.password) {
      data.password = CLIENTES[index].password;
    }
    CLIENTES[index] = { ...CLIENTES[index], ...data };
    return CLIENTES[index];
  }

  delete(id: number): void {
    const index = CLIENTES.findIndex(c => c.id === id);
    if (index !== -1) CLIENTES.splice(index, 1);
  }
}
