import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { PedidoService } from '../../services/pedido.service';
import { CarritoService } from '../../services/carrito.service';

type ResultadoEstado = 'cargando' | 'aprobado' | 'pendiente' | 'rechazado' | 'desconocido';

const API_URL = 'http://localhost:8090';

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
  private pollingTimer: any = null;
  private pollingIntentos = 0;
  private readonly POLLING_INTERVALO_MS = 30_000;
  private readonly POLLING_MAX_INTENTOS = 20; // 10 minutos

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private pedidoService: PedidoService,
    private carritoService: CarritoService
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
      this.http.get<PagoMP>(`${API_URL}/api/mp/payment/${this.paymentId}`).subscribe({
        next: (p) => {
          if (this.destruido) return;
          this.pago = p;
          this.estado = this.mapearEstado(p.status);
          if (p.transaction_amount) this.total = p.transaction_amount;
          this.programarRedireccion();
        },
        error: () => {
          if (this.destruido) return;
          if (this.collectionStatus) {
            this.estado = this.mapearEstado(this.collectionStatus);
            this.programarRedireccion();
          } else {
            this.consultarPedido();
          }
        }
      });
    } else if (this.collectionStatus) {
      this.estado = this.mapearEstado(this.collectionStatus);
      this.programarRedireccion();
    } else {
      this.consultarPedido();
    }
  }

  private consultarPedido(): void {
    if (!this.pedidoId || isNaN(this.pedidoId)) {
      this.estado = 'desconocido';
      return;
    }
    this.pedidoService.getById(this.pedidoId).subscribe({
      next: (pedido) => {
        if (this.destruido) return;
        const ep = (pedido?.estadoPago || '').toUpperCase();
        if (ep === 'APROBADO') this.estado = 'aprobado';
        else if (ep === 'EN_PROCESO' || ep === 'PENDIENTE') this.estado = 'pendiente';
        else if (ep === 'RECHAZADO') this.estado = 'rechazado';
        else this.estado = 'desconocido';

        if (pedido?.totalPagado) this.total = pedido.totalPagado;
        if (pedido?.mpPaymentId) {
          this.pago = {
            id: pedido.mpPaymentId,
            status: ep.toLowerCase(),
            payment_method_id: pedido.mpPaymentMethod,
            payment_type_id: pedido.mpPaymentType,
            transaction_amount: pedido.totalPagado,
            currency_id: 'COP',
            date_approved: pedido.fechaPago
          };
        }
        this.programarRedireccion();
      },
      error: () => {
        if (this.destruido) return;
        this.estado = 'desconocido';
      }
    });
  }

  ngOnDestroy(): void {
    this.destruido = true;
    if (this.timerRedireccion) clearTimeout(this.timerRedireccion);
    this.detenerPolling();
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
      this.carritoService.limpiarTrasCheckout();
      this.timerRedireccion = setTimeout(() => {
        if (!this.destruido) this.irAMisPedidos();
      }, 5000);
    } else if (this.estado === 'pendiente') {
      this.iniciarPolling();
    }
  }

  private iniciarPolling(): void {
    if (this.pollingTimer) return;
    this.pollingTimer = setInterval(() => {
      if (this.destruido || this.pollingIntentos >= this.POLLING_MAX_INTENTOS) {
        this.detenerPolling();
        return;
      }
      this.pollingIntentos++;
      this.pedidoService.sincronizarPagoMP(this.pedidoId).subscribe({
        next: (pago) => {
          if (this.destruido) return;
          const s = (pago?.status || '').toLowerCase();
          const estadoResultado = this.mapearEstado(s);
          if (estadoResultado === 'aprobado') {
            this.estado = 'aprobado';
            if (pago.transaction_amount) this.total = pago.transaction_amount;
            this.detenerPolling();
            this.programarRedireccion();
          } else if (estadoResultado === 'rechazado') {
            this.estado = 'rechazado';
            this.detenerPolling();
          }
        },
        error: () => {
          // Si sincronizar falla (sin mpPaymentId aún), fallback a leer el pedido
          this.pedidoService.getById(this.pedidoId).subscribe({
            next: (pedido) => {
              if (this.destruido) return;
              const ep = (pedido?.estadoPago || '').toUpperCase();
              if (ep === 'APROBADO') {
                this.estado = 'aprobado';
                if (pedido.totalPagado) this.total = pedido.totalPagado;
                this.detenerPolling();
                this.programarRedireccion();
              } else if (ep === 'RECHAZADO') {
                this.estado = 'rechazado';
                this.detenerPolling();
              }
            },
            error: () => {}
          });
        }
      });
    }, this.POLLING_INTERVALO_MS);
  }

  private detenerPolling(): void {
    if (this.pollingTimer) {
      clearInterval(this.pollingTimer);
      this.pollingTimer = null;
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
