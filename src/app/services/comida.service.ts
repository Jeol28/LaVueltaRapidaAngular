import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Comida } from '../models/comida.model';

const API_URL = 'http://localhost:8090';

@Injectable({ providedIn: 'root' })
export class ComidaService {

  constructor(private http: HttpClient) {}

  getAll(): Observable<Comida[]> {
    return this.http.get<Comida[]>(`${API_URL}/comidas`);
  }

  getById(id: number): Observable<Comida> {
    return this.http.get<Comida>(`${API_URL}/comidas/${id}`);
  }

  getRecomendaciones(comida: Comida, comidas: Comida[]): Comida[] {
    return comidas.filter(c => c.available && c.id !== comida.id && c.category.id === comida.category.id);
  }

  add(data: { name: string; description: string; price: number | null; categoryId: number | null; image: string; available: boolean }): Observable<Comida> {
    return this.http.post<Comida>(`${API_URL}/comidas`, data);
  }

  update(id: number, data: { name: string; description: string; price: number | null; categoryId: number | null; image: string; available: boolean }): Observable<Comida> {
    return this.http.put<Comida>(`${API_URL}/comidas/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${API_URL}/comidas/${id}`);
  }
}
