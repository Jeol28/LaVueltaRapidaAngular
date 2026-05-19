import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { Carrito } from '../models/carrito.model';

const API_URL = '/api';

export interface LoginResult {
  token: string;
  username: string;
  role: 'admin' | 'operador' | 'cliente';
  clienteId?: number;
  carritoId?: number;
}

export interface MeResponse {
  id: number;
  role: 'cliente' | 'admin' | 'operador';
  username: string;
  name?: string;
  apellido?: string;
  email?: string;
  direccion?: string;
  telefono?: string;
}

interface LoginResponse {
  token: string;
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

  verify(username: string, role: string): Observable<boolean> {
    return this.http
      .get(`${API_URL}/auth/verify`, { params: { username, role }, observe: 'response' })
      .pipe(
        map(res => res.status === 200),
        catchError(() => of(false))
      );
  }

  getMe(): Observable<MeResponse> {
    return this.http.get<MeResponse>(`${API_URL}/auth/me`);
  }

  solicitarRecuperacion(email: string): Observable<void> {
    return this.http.post<void>(`${API_URL}/auth/recuperar-contrasena`, { email });
  }

  resetContrasena(token: string, nuevaContrasena: string): Observable<void> {
    return this.http.post<void>(`${API_URL}/auth/reset-contrasena`, { token, nuevaContrasena });
  }
}
