import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const API_URL = 'http://localhost:8090';

export interface PreferenciaMP {
  id: string;
  init_point: string;
  sandbox_init_point: string;
}

export interface PreferenciaRequest {
  pedidoId: number;
  total: number;
  items?: Array<{ id: string; title: string; quantity: number; unit_price: number }>;
  origin?: string;
  payer?: {
    name?: string;
    surname?: string;
    email?: string;
    phone?: { area_code: string; number: string };
    address?: { street_name: string };
  };
}

export interface PagoCardRequest {
  token: string;
  amount: number;
  payment_method_id: string;
  installments: number;
  payer: {
    email: string;
    identification?: { type: string; number: string };
  };
  pedidoId: number;
}

export interface PagoCardResponse {
  status: string;
  status_detail: string;
  id: number;
}

@Injectable({ providedIn: 'root' })
export class PagoService {

  constructor(private http: HttpClient) {}

  crearPreferencia(req: PreferenciaRequest): Observable<PreferenciaMP> {
    return this.http.post<PreferenciaMP>(`${API_URL}/api/mp/preference`, req);
  }

  procesarPagoTarjeta(req: PagoCardRequest): Observable<PagoCardResponse> {
    return this.http.post<PagoCardResponse>(`${API_URL}/api/mp/payment`, req);
  }

  // Backend debe implementar: PATCH /api/pedido/{id}/pago-presencial con body { metodoPago }
  confirmarPresencial(pedidoId: number, metodoPago: string): Observable<any> {
    return this.http.patch(`${API_URL}/api/pedido/${pedidoId}/pago-presencial`, { metodoPago });
  }
}
