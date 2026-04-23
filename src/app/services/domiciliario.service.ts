import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Domiciliario } from '../models/domiciliario.model';

const API_URL = 'http://localhost:8090';

@Injectable({ providedIn: 'root' })
export class DomiciliarioService {

  constructor(private http: HttpClient) {}

  getAll(): Observable<Domiciliario[]> {
    return this.http.get<Domiciliario[]>(`${API_URL}/domiciliarios`);
  }

  getById(id: number): Observable<Domiciliario> {
    return this.http.get<Domiciliario>(`${API_URL}/domiciliarios/${id}`);
  }

  add(data: { nombre: string; cedula: string; celular: string; disponible: boolean }): Observable<Domiciliario> {
    return this.http.post<Domiciliario>(`${API_URL}/domiciliarios`, data);
  }

  update(id: number, data: Partial<Domiciliario>): Observable<Domiciliario> {
    return this.http.put<Domiciliario>(`${API_URL}/domiciliarios/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${API_URL}/domiciliarios/${id}`);
  }
}
