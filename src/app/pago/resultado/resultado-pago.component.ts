import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

type ResultadoEstado = 'cargando' | 'aprobado' | 'pendiente' | 'rechazado' | 'desconocido';

interface PagoMP {
  id: number | string;
  status: string;
  status_detail?: string;
  payment_method_id?: string;
  payment_type_id?: string;
  transaction_amount?: number;
  currency_id?: string;
  external_reference?: string;
  date_approved?: string;
  payer?: { email?: string };
}

@Component({
  selector: 'app-resultado-pago',
  templateUrl: './resultado-pago.component.html',
  styleUrls: ['./resultado-pago.component.css']
})
export class ResultadoPagoComponent implements OnInit, OnDestroy {

  pedidoId!: number;
  estado: ResultadoEstado = 'cargando';
  pago: PagoMP | null = null;
  errorMsg: string = '';

  collectionStatus: string = '';
  paymentId: string = '';
  preferenceId: string = '';
  externalReference: string = '';

  total: number = 0;

  private destruido = false;
  private timerRedireccion: any = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.pedidoId = +this.route.snapshot.paramMap.get('pedidoId')!;
    const qp = this.route.snapshot.queryParamMap;

    this.collectionStatus  = qp.get('collection_status') || qp.get('status') || '';
    this.paymentId         = qp.get('payment_id') || qp.get('collection_id') || '';
    this.preferenceId      = qp.get('preference_id') || '';
    this.externalReference = qp.get('external_reference') || '';

    try {
      const raw = localStorage.getItem(`lvr-pedido-total-${this.pedidoId}`);
      if (raw) this.total = +raw;
    } catch {}

    if (this.paymentId) {
      this.http.get<PagoMP>(`/api/mp/payment/${this.paymentId}`).subscribe({
        next: (p) => {
          if (this.destruido) return;
          this.pago = p;
          this.estado = this.mapearEstado(p.status);
          if (p.transaction_amount) this.total = p.transaction_amount;
          this.programarRedireccion();
        },
        error: () => {
          if (this.destruido) return;
          this.estado = this.mapearEstado(this.collectionStatus);
          this.programarRedireccion();
        }
      });
    } else {
      this.estado = this.mapearEstado(this.collectionStatus);
      this.programarRedireccion();
    }
  }

  ngOnDestroy(): void {
    this.destruido = true;
    if (this.timerRedireccion) clearTimeout(this.timerRedireccion);
  }

  private mapearEstado(raw: string): ResultadoEstado {
    const s = (raw || '').toLowerCase();
    if (s === 'approved' || s === 'success') return 'aprobado';
    if (s === 'pending' || s === 'in_process' || s === 'in_mediation') return 'pendiente';
    if (s === 'rejected' || s === 'failure' || s === 'cancelled' || s === 'refunded' || s === 'charged_back') return 'rechazado';
    if (!s) return 'desconocido';
    return 'desconocido';
  }

  private programarRedireccion(): void {
    if (this.estado === 'aprobado') {
      this.timerRedireccion = setTimeout(() => {
        if (!this.destruido) this.irAMisPedidos();
      }, 5000);
    }
  }

  irAMisPedidos(): void {
    this.router.navigate(['/perfil'], {
      fragment: 'mis-pedidos',
      queryParams: { pedido: this.pedidoId }
    });
  }

  reintentar(): void {
    this.router.navigate(['/pago', this.pedidoId]);
  }

  formatCOP(amount: number): string {
    return new Intl.NumberFormat('es-CO').format(amount);
  }

  metodoLegible(): string {
    const m = (this.pago?.payment_method_id || '').toLowerCase();
    const t = (this.pago?.payment_type_id  || '').toLowerCase();
    if (m === 'visa') return 'Tarjeta Visa';
    if (m === 'master' || m === 'mastercard') return 'Tarjeta Mastercard';
    if (m === 'amex') return 'Tarjeta American Express';
    if (m === 'pse') return 'PSE';
    if (m === 'efecty') return 'Efecty';
    if (t === 'credit_card') return 'Tarjeta de crédito';
    if (t === 'debit_card') return 'Tarjeta de débito';
    if (t === 'ticket') return 'Pago en efectivo';
    if (t === 'bank_transfer') return 'Transferencia bancaria';
    if (t === 'account_money') return 'Mercado Pago';
    return this.pago?.payment_method_id || this.pago?.payment_type_id || '—';
  }
}
