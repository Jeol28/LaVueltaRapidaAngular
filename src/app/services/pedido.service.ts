import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Pedido } from '../models/pedido.model';
import { EstadoPedido } from '../models/estado-pedido.model';

const API_URL = 'http://localhost:8090';

@Injectable({ providedIn: 'root' })
export class PedidoService {

  constructor(private http: HttpClient) {}

  getAll(): Observable<Pedido[]> {
    return this.http.get<Pedido[]>(`${API_URL}/pedido`);
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
