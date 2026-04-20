import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, map, Observable, throwError } from 'rxjs';
import { Administrador } from '../models/administrador.model';
import { Cliente } from '../models/cliente.model';
import { Operador } from '../models/operador.model';

const API_URL = 'http://localhost:8090';

@Injectable({ providedIn: 'root' })
export class AuthService {

  constructor(private http: HttpClient) {}

  login(usuario: string, contrasena: string): Observable<{ username: string; role: 'admin' | 'operador' | 'cliente' }> {
    return forkJoin({
      admins: this.http.get<Administrador[]>(`${API_URL}/administradores`),
      operadores: this.http.get<Operador[]>(`${API_URL}/operadores`),
      clientes: this.http.get<Cliente[]>(`${API_URL}/clientes`)
    }).pipe(
      map(({ admins, operadores, clientes }) => {
        const admin = admins.find(a => a.usuario === usuario && a.contrasena === contrasena);
        if (admin) {
          return { username: admin.usuario, role: 'admin' };
        }

        const operador = operadores.find(o => o.usuario === usuario && o.contrasena === contrasena);
        if (operador) {
          return { username: operador.usuario, role: 'operador' };
        }

        const cliente = clientes.find(c => c.username === usuario && c.password === contrasena);
        if (cliente) {
          return { username: cliente.username, role: 'cliente' };
        }

        throw new Error('Credenciales inválidas');
      })
    );
  }
}
