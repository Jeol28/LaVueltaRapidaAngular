import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { Carrito } from '../models/carrito.model';

const API_URL = 'http://localhost:8090';

export interface LoginResult {
  username: string;
  role: 'admin' | 'operador' | 'cliente';
  clienteId?: number;
  carritoId?: number;
}

interface LoginResponse {
  username: string;
  role: 'admin' | 'operador' | 'cliente';
  clienteId?: number;
  carritoId?: number;
}

@Injectable({ providedIn: 'root' })
export class AuthService {

  constructor(private http: HttpClient) {}

  login(usuario: string, contrasena: string): Observable<LoginResult> {
    return this.http
      .post<LoginResponse>(`${API_URL}/auth/login`, { usuario, contrasena })
      .pipe(
        switchMap(res => {
          if (res.role === 'cliente' && res.clienteId != null && res.carritoId == null) {
            return this.fetchCarritoId(res.clienteId).pipe(
              map(carritoId => ({ ...res, carritoId: carritoId ?? undefined }))
            );
          }
          return of(res);
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
