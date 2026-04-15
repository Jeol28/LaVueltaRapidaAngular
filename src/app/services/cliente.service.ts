import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, map, Observable } from 'rxjs';
import { Cliente } from '../models/cliente.model';
import { Administrador } from '../models/administrador.model';
import { Operador } from '../models/operador.model';

const API_URL = 'http://localhost:8090';

@Injectable({ providedIn: 'root' })
export class ClienteService {

  constructor(private http: HttpClient) {}

  getAll(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(`${API_URL}/clientes`);
  }

  findByUsername(username: string): Observable<Cliente | undefined> {
    return this.getAll().pipe(
      map(clientes => clientes.find(c => c.username === username))
    );
  }

  isUsernameTaken(username: string, excludeId: number): Observable<boolean> {
    return forkJoin({
      clientes: this.getAll(),
      administradores: this.http.get<Administrador[]>(`${API_URL}/administradores`),
      operadores: this.http.get<Operador[]>(`${API_URL}/operadores`)
    }).pipe(
      map(({ clientes, administradores, operadores }) => {
        return (
          clientes.some(c => c.username === username && c.id !== excludeId) ||
          administradores.some(a => a.usuario === username && a.id !== excludeId) ||
          operadores.some(o => o.usuario === username && o.id !== excludeId)
        );
      })
    );
  }

  update(id: number, data: Partial<Cliente>): Observable<Cliente> {
    return this.http.put<Cliente>(`${API_URL}/clientes/${id}`, data);
  }

  add(data: Omit<Cliente, 'id'>): Observable<Cliente> {
    return this.http.post<Cliente>(`${API_URL}/clientes`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${API_URL}/clientes/${id}`);
  }
}
