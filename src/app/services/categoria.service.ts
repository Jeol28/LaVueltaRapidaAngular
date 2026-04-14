import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Categoria } from '../models/categoria.model';

const API_URL = 'http://localhost:8090';

@Injectable({ providedIn: 'root' })
export class CategoriaService {

  constructor(private http: HttpClient) {}

  getAll() {
  return this.http.get<Categoria[]>('http://localhost:8080/api/menu/categorias');
}

  getById(id: number): Observable<Categoria> {
    return this.http.get<Categoria>(`${API_URL}/categorias/${id}`);
  }
}
