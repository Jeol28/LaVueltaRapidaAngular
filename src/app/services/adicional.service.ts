import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Adicional } from '../models/adicional.model';

const API_URL = 'http://localhost:8090';

@Injectable({ providedIn: 'root' })
export class AdicionalService {

  constructor(private http: HttpClient) {}

  getAll(): Observable<Adicional[]> {
    return this.http.get<Adicional[]>(`${API_URL}/adicionales`);
  }

  getById(id: number): Observable<Adicional> {
    return this.http.get<Adicional>(`${API_URL}/adicionales/${id}`);
  }

  add(data: { name: string; price: number | null; available: boolean }): Observable<Adicional> {
    return this.http.post<Adicional>(`${API_URL}/adicionales`, data);
  }

  update(id: number, data: { name: string; price: number | null; available: boolean }): Observable<Adicional> {
    return this.http.put<Adicional>(`${API_URL}/adicionales/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${API_URL}/adicionales/${id}`);
  }
}
