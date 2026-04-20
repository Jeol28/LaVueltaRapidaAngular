import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, map, Observable, switchMap, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Administrador } from '../models/administrador.model';
import { Cliente } from '../models/cliente.model';
import { Operador } from '../models/operador.model';
import { Carrito } from '../models/carrito.model';

const API_URL = 'http://localhost:8090';

export interface LoginResult {
  username: string;
  role: 'admin' | 'operador' | 'cliente';
  clienteId?: number;
  carritoId?: number;
}

@Injectable({ providedIn: 'root' })
export class AuthService {

  constructor(private http: HttpClient) {}

  login(usuario: string, contrasena: string): Observable<LoginResult> {
    return forkJoin({
      admins: this.http.get<Administrador[]>(`${API_URL}/administradores`),
      operadores: this.http.get<Operador[]>(`${API_URL}/operadores`),
      clientes: this.http.get<Cliente[]>(`${API_URL}/clientes`)
    }).pipe(
      switchMap(({ admins, operadores, clientes }) => {
        const admin = admins.find(a => a.usuario === usuario && a.contrasena === contrasena);
        if (admin) {
          return of<LoginResult>({ username: admin.usuario, role: 'admin' });
        }

        const operador = operadores.find(o => o.usuario === usuario && o.contrasena === contrasena);
        if (operador) {
          return of<LoginResult>({ username: operador.usuario, role: 'operador' });
        }

        const cliente = clientes.find(c => c.username === usuario && c.password === contrasena);
        if (cliente) {
          return this.http.get<Carrito>(`${API_URL}/carrito/cliente/${cliente.id}`).pipe(
            catchError(() => of(null)),
            map(carrito => ({
              username: cliente.username,
              role: 'cliente' as const,
              clienteId: cliente.id,
              carritoId: carrito?.id
            }))
          );
        }

        throw new Error('Credenciales inválidas');
      })
    );
  }

  fetchCarritoId(clienteId: number): Observable<number | null> {
    return this.http.get<Carrito>(`${API_URL}/carrito/cliente/${clienteId}`).pipe(
      map(c => c.id),
      catchError(() => of(null))
    );
  }
}
