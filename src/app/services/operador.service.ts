import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Operador } from '../models/operador.model';

const API_URL = 'http://localhost:8090';

@Injectable({ providedIn: 'root' })
export class OperadorService {

  constructor(private http: HttpClient) {}

  getAll(): Observable<Operador[]> {
    return this.http.get<Operador[]>(`${API_URL}/operadores`);
  }

  getById(id: number): Observable<Operador> {
    return this.http.get<Operador>(`${API_URL}/operadores/${id}`);
  }

  add(data: { nombre: string; usuario: string; contrasena: string }): Observable<Operador> {
    return this.http.post<Operador>(`${API_URL}/operadores`, data);
  }

  update(id: number, data: Partial<Operador>): Observable<Operador> {
    return this.http.put<Operador>(`${API_URL}/operadores/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${API_URL}/operadores/${id}`);
  }
}
