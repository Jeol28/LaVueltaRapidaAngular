import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, map, Observable } from 'rxjs';
import { Administrador } from '../models/administrador.model';
import { Cliente } from '../models/cliente.model';
import { Operador } from '../models/operador.model';
import { AuthService } from './auth.service';

const API_URL = '/api';

@Injectable({ providedIn: 'root' })
export class AdminService {

  constructor(private http: HttpClient, private authService: AuthService) {}

  getAll(): Observable<Administrador[]> {
    return this.http.get<Administrador[]>(`${API_URL}/administradores`);
  }

  getMe(): Observable<Administrador> {
    return this.authService.getMe().pipe(
      map(r => ({ id: r.id, usuario: r.username }))
    );
  }

  findByUsuario(usuario: string): Observable<Administrador | undefined> {
    return this.getAll().pipe(
      map(administradores => administradores.find(a => a.usuario === usuario))
    );
  }

  isUsernameTaken(usuario: string, excludeId: number): Observable<boolean> {
    return forkJoin({
      administradores: this.getAll(),
      clientes: this.http.get<Cliente[]>(`${API_URL}/clientes`),
      operadores: this.http.get<Operador[]>(`${API_URL}/operadores`)
    }).pipe(
      map(({ administradores, clientes, operadores }) => {
        return (
          administradores.some(a => a.usuario === usuario && a.id !== excludeId) ||
          clientes.some(c => c.username === usuario && c.id !== excludeId) ||
          operadores.some(o => o.usuario === usuario && o.id !== excludeId)
        );
      })
    );
  }

  update(id: number, data: Partial<Administrador>): Observable<Administrador> {
    return this.http.put<Administrador>(`${API_URL}/administradores/${id}`, data);
  }
}
