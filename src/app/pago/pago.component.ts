import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { PedidoService } from '../services/pedido.service';
import { Pedido } from '../models/pedido.model';

interface PreferenciaMP {
  id: string;
  init_point: string;
  sandbox_init_point: string;
}

const API_URL = 'http://localhost:8090';

@Component({
  selector: 'app-pago',
  templateUrl: './pago.component.html',
  styleUrls: ['./pago.component.css']
})
export class PagoComponent implements OnInit, OnDestroy {

  pedidoId!: number;
  pedido: Pedido | null = null;
  total: number = 0;

  cargando: boolean = true;
  errorCarga: string = '';
  pedidoNoEncontrado: boolean = false;

  redirigiendo: boolean = false;
  errorPago: string = '';
  refTransaccion: string = '';

  private destruido: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private pedidoService: PedidoService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    if (!localStorage.getItem('user')) {
      this.router.navigate(['/login']);
      return;
    }

    this.pedidoId = +this.route.snapshot.paramMap.get('pedidoId')!;

    const navState = this.router.getCurrentNavigation()?.extras?.state as { total?: number } | undefined;
    const stateTotal = navState?.total ?? history.state?.total;
    if (stateTotal) {
      this.total = +stateTotal;
      this.guardarTotalLocal(this.pedidoId, this.total);
    } else {
      const saved = this.leerTotalLocal(this.pedidoId);
      if (saved) this.total = saved;
    }

    this.refTransaccion = this.generarReferencia();

    if (!this.pedidoId || isNaN(this.pedidoId)) {
      this.errorCarga = 'Pedido no válido.';
      this.cargando = false;
      return;
    }

    this.pedidoService.getById(this.pedidoId).subscribe({
      next: (pedido) => {
        this.pedido = pedido;
        if (!this.total) {
          this.total = this.calcularTotalDePedido(pedido);
          this.guardarTotalLocal(this.pedidoId, this.total);
        }
        this.cargando = false;
      },
      error: () => {
        this.cargando = false;
        this.pedidoNoEncontrado = true;
        this.errorCarga = 'No pudimos verificar tu pedido. Tu transacción no puede continuar hasta restablecer la conexión.';
      }
    });
  }

  ngOnDestroy(): void {
    this.destruido = true;
  }

  pagarConMercadoPago(): void {
    if (this.redirigiendo || this.pedidoNoEncontrado || !this.total) return;
    this.errorPago = '';
    this.redirigiendo = true;

    const items = (this.pedido?.lineasPedido || []).map((lp) => {
      const adicionales = (lp.adicionales || []).reduce(
        (s, a) => s + (a.adicional?.price ?? 0), 0
      );
      const unit = (lp.comida?.price ?? 0) + adicionales;
      const titulo = lp.comida?.name ?? 'Producto';
      return {
        id: String(lp.comida?.id ?? 'item'),
        title: titulo,
        quantity: lp.cantidad ?? 1,
        unit_price: unit
      };
    });

    const cliente = this.pedido?.cliente;
    const payer = cliente ? {
      name: cliente.name,
      surname: cliente.apellido,
      email: cliente.email,
      phone: cliente.telefono ? { area_code: '57', number: cliente.telefono } : undefined,
      address: cliente.direccion ? { street_name: cliente.direccion } : undefined
    } : undefined;

    const body = {
      pedidoId: this.pedidoId,
      total: this.total,
      items: items.length > 0 ? items : undefined,
      origin: window.location.origin,
      payer
    };

    this.http.post<PreferenciaMP>(`${API_URL}/api/mp/preference`, body).subscribe({
      next: (resp) => {
        if (this.destruido) return;
        const url = resp.init_point || resp.sandbox_init_point;
        if (!url) {
          this.redirigiendo = false;
          this.errorPago = 'No recibimos la URL de pago. Intenta nuevamente.';
          return;
        }
        window.location.href = url;
      },
      error: (err) => {
        if (this.destruido) return;
        this.redirigiendo = false;
        const detail = err?.error?.detail || err?.error?.error || err?.message;
        this.errorPago = 'No pudimos conectar con la pasarela de pagos. ' + (detail ? `(${detail})` : 'Intenta más tarde.');
      }
    });
  }

  cancelar(): void {
    this.router.navigate(['/perfil'], { fragment: 'mis-pedidos' });
  }

  verificarPago(): void {
    if (!this.pedidoId) return;
    this.router.navigate(['/pago/resultado', this.pedidoId]);
  }

  formatCOP(amount: number): string {
    return new Intl.NumberFormat('es-CO').format(amount);
  }

  private calcularTotalDePedido(p: Pedido): number {
    if (!p?.lineasPedido?.length) return 0;
    return p.lineasPedido.reduce((sum, lp) => {
      const adicionales = (lp.adicionales ?? []).reduce(
        (s, a) => s + (a.adicional?.price ?? 0), 0
      );
      const precioBase = lp.comida?.price ?? 0;
      return sum + (precioBase + adicionales) * (lp.cantidad ?? 0);
    }, 0);
  }

  private generarReferencia(): string {
    const t = Date.now().toString(36).toUpperCase();
    const r = Math.random().toString(36).slice(2, 6).toUpperCase();
    return `LVR-${t}-${r}`;
  }

  private guardarTotalLocal(pedidoId: number, total: number): void {
    try { localStorage.setItem(`lvr-pedido-total-${pedidoId}`, String(total)); } catch {}
  }

  private leerTotalLocal(pedidoId: number): number {
    try {
      const raw = localStorage.getItem(`lvr-pedido-total-${pedidoId}`);
      return raw ? +raw : 0;
    } catch { return 0; }
  }
}
