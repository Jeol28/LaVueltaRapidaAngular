import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Pedido } from '../models/pedido.model';
import { EstadoPedido } from '../models/estado-pedido.model';

const API_URL = 'http://localhost:8090';

interface PageResponse<T> {
  content: T[];
  size: number;
  page: number;
  totalPages: number;
  totalElements: number;
}

@Injectable({ providedIn: 'root' })
export class PedidoService {

  constructor(private http: HttpClient) {}

  getAll(page: number = 0, size: number = 1000): Observable<Pedido[]> {
    const params = new HttpParams()
      .set('page', String(page))
      .set('size', String(size));
    return this.http
      .get<PageResponse<Pedido> | Pedido[]>(`${API_URL}/pedido`, { params })
      .pipe(map(res => Array.isArray(res) ? res : (res?.content ?? [])));
  }

  getActivos(): Observable<Pedido[]> {
    return this.http.get<Pedido[]>(`${API_URL}/pedido/activos`);
  }

  getByCliente(clienteId: number): Observable<Pedido[]> {
    return this.http.get<Pedido[]>(`${API_URL}/pedido/cliente/${clienteId}`);
  }

  getById(id: number): Observable<Pedido> {
    return this.http.get<Pedido>(`${API_URL}/pedido/${id}`);
  }

  updateEstado(id: number, estado: EstadoPedido): Observable<Pedido> {
    return this.http.patch<Pedido>(`${API_URL}/pedido/${id}/estado`, { estado });
  }

  crearDesdeCarrito(carritoId: number): Observable<Pedido> {
    return this.http.post<Pedido>(`${API_URL}/pedido/desde-carrito/${carritoId}`, {});
  }
}
