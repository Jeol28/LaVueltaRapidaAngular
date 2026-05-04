import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PedidoService } from '../services/pedido.service';
import { PagoService } from '../services/pago.service';
import { Pedido } from '../models/pedido.model';

declare const MercadoPago: any;

// Reemplazar con la public key real de Mercado Pago
const MP_PUBLIC_KEY = 'APP_USR-dbe06744-e92d-4f6b-8ea6-980cd86d9b35';

type Paso = 'seleccion' | 'tarjeta' | 'procesando' | 'exito' | 'error-pago';
type MetodoPresencial = 'efectivo' | 'datafono' | 'nequi' | 'daviplata' | 'transferencia' | 'llave';

@Component({
  selector: 'app-pago',
  templateUrl: './pago.component.html',
  styleUrls: ['./pago.component.css']
})
export class PagoComponent implements OnInit, OnDestroy {

  pedidoId!: number;
  pedido: Pedido | null = null;
  total: number = 0;

  cargando = true;
  errorCarga = '';
  pedidoNoEncontrado = false;

  paso: Paso = 'seleccion';
  private pasoPrevio: Paso = 'seleccion';

  redirigiendo = false;
  errorPago = '';
  exito: { metodo: string; detalle?: string } | null = null;

  // Formulario de tarjeta
  cardNumber = '';
  cardName = '';
  cardExpiry = '';
  cardCvc = '';
  cardDocType = 'CC';
  cardDocNum = '';
  installments = 1;
  cardBrand = '';

  refTransaccion = '';
  private destruido = false;
  private mp: any = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private pedidoService: PedidoService,
    private pagoService: PagoService
  ) {}

  ngOnInit(): void {
    if (!localStorage.getItem('user')) {
      this.router.navigate(['/login']);
      return;
    }

    this.pedidoId = +this.route.snapshot.paramMap.get('pedidoId')!;
    this.refTransaccion = this.generarReferencia();

    const stateTotal = history.state?.total;
    if (stateTotal) {
      this.total = +stateTotal;
      this.guardarTotalLocal(this.pedidoId, this.total);
    } else {
      const saved = this.leerTotalLocal(this.pedidoId);
      if (saved) this.total = saved;
    }

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

  // ── A) Mercado Pago Checkout Pro ──────────────────────────────────────────

  pagarConMercadoPago(): void {
    if (this.redirigiendo || this.pedidoNoEncontrado || !this.total) return;
    this.errorPago = '';
    this.redirigiendo = true;

    const items = (this.pedido?.lineasPedido || []).map(lp => {
      const adicionales = (lp.adicionales || []).reduce(
        (s, a) => s + (a.adicional?.price ?? 0), 0
      );
      return {
        id: String(lp.comida?.id ?? 'item'),
        title: lp.comida?.name ?? 'Producto',
        quantity: lp.cantidad ?? 1,
        unit_price: (lp.comida?.price ?? 0) + adicionales
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

    this.pagoService.crearPreferencia({
      pedidoId: this.pedidoId,
      total: this.total,
      items: items.length > 0 ? items : undefined,
      origin: window.location.origin,
      payer
    }).subscribe({
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

  // ── B) Tarjeta directa (Checkout API) ────────────────────────────────────

  irAFormularioTarjeta(): void {
    this.errorPago = '';
    this.pasoPrevio = 'seleccion';
    this.paso = 'tarjeta';
  }

  onCardNumberInput(): void {
    const raw = this.cardNumber.replace(/\D/g, '').slice(0, 16);
    this.cardNumber = raw.replace(/(.{4})/g, '$1 ').trim();
    if (/^4/.test(raw)) this.cardBrand = 'visa';
    else if (/^5[1-5]/.test(raw)) this.cardBrand = 'mastercard';
    else if (/^3[47]/.test(raw)) this.cardBrand = 'amex';
    else this.cardBrand = '';
  }

  onExpiryInput(): void {
    const raw = this.cardExpiry.replace(/\D/g, '').slice(0, 4);
    this.cardExpiry = raw.length >= 3 ? raw.slice(0, 2) + '/' + raw.slice(2) : raw;
  }

  async pagarConTarjeta(): Promise<void> {
    if (!this.validarFormularioTarjeta()) return;
    this.errorPago = '';
    this.pasoPrevio = 'tarjeta';
    this.paso = 'procesando';

    try {
      await this.cargarSdkMP();

      if (!this.mp) {
        this.mp = new MercadoPago(MP_PUBLIC_KEY, { locale: 'es-CO' });
      }

      const [mes, anio] = this.cardExpiry.split('/');
      const cardToken = await this.mp.createCardToken({
        cardNumber: this.cardNumber.replace(/\s/g, ''),
        cardholderName: this.cardName,
        cardExpirationMonth: mes.trim(),
        cardExpirationYear: '20' + anio.trim(),
        securityCode: this.cardCvc,
        identificationType: this.cardDocType,
        identificationNumber: this.cardDocNum
      });

      console.log('cardToken.id:', cardToken.id);

      const cliente = this.pedido?.cliente;

      this.pagoService.procesarPagoTarjeta({
        token: cardToken.id,
        transaction_amount: this.total,
        payment_method_id: this.cardBrand || 'visa',
        installments: +this.installments,
        payer: {
          email: cliente?.email ?? '',
          identification: this.cardDocNum
            ? { type: this.cardDocType, number: this.cardDocNum }
            : undefined
        },
        pedidoId: this.pedidoId
      }).subscribe({
        next: (resp) => {
          if (this.destruido) return;
          if (resp.status === 'approved') {
            this.exito = { metodo: 'Tarjeta', detalle: `ID: ${resp.id}` };
            this.paso = 'exito';
          } else if (resp.status === 'in_process' || resp.status === 'pending') {
            this.errorPago = 'Tu pago está en revisión. Te notificaremos cuando se confirme.';
            this.paso = 'error-pago';
          } else {
            this.errorPago = `Pago rechazado: ${resp.status_detail || 'verifica los datos de tu tarjeta'}.`;
            this.paso = 'error-pago';
          }
        },
        error: (err) => {
          if (this.destruido) return;
          const msg = err?.error?.message || err?.error?.detail || 'Error al procesar el pago con tarjeta.';
          this.errorPago = msg;
          this.paso = 'error-pago';
        }
      });

    } catch (err: any) {
      console.error('MP SDK error:', err);
      let msg = 'Error al generar el token de tarjeta. Verifica los datos e intenta nuevamente.';
      if (Array.isArray(err)) {
        msg = (err as any[]).map((e) => e.message || e).join(' · ');
      } else if (err?.message) {
        msg = err.message;
      }
      this.errorPago = msg;
      this.paso = 'error-pago';
    }
  }

  // ── C) Pago presencial contra entrega ─────────────────────────────────────

  seleccionarPresencial(metodo: MetodoPresencial): void {
    this.errorPago = '';
    this.pasoPrevio = 'seleccion';
    this.paso = 'procesando';

    this.pagoService.confirmarPresencial(this.pedidoId, metodo).subscribe({
      next: () => {
        if (this.destruido) return;
        this.exito = { metodo: this.labelPresencial(metodo) };
        this.paso = 'exito';
      },
      error: (err) => {
        if (this.destruido) return;
        const msg = err?.error?.message || err?.error?.error || 'Error al confirmar el pedido.';
        this.errorPago = msg;
        this.paso = 'error-pago';
      }
    });
  }

  // ── Navegación ────────────────────────────────────────────────────────────

  volver(): void {
    this.paso = this.pasoPrevio;
    this.errorPago = '';
  }

  cancelar(): void {
    this.router.navigate(['/perfil'], { fragment: 'mis-pedidos' });
  }

  irAMisPedidos(): void {
    this.router.navigate(['/perfil'], { fragment: 'mis-pedidos' });
  }

  verificarPago(): void {
    this.router.navigate(['/pago/resultado', this.pedidoId]);
  }

  // ── Utils ─────────────────────────────────────────────────────────────────

  formatCOP(amount: number): string {
    return new Intl.NumberFormat('es-CO').format(amount);
  }

  labelPresencial(metodo: MetodoPresencial): string {
    const labels: Record<MetodoPresencial, string> = {
      efectivo: 'Efectivo contra entrega',
      datafono: 'Datáfono al recibir',
      nequi: 'Nequi al recibir',
      daviplata: 'Daviplata al recibir',
      transferencia: 'Transferencia al recibir',
      llave: 'Llave (QR) al recibir'
    };
    return labels[metodo];
  }

  private validarFormularioTarjeta(): boolean {
    const num = this.cardNumber.replace(/\s/g, '');
    if (num.length < 13) {
      this.errorPago = 'Número de tarjeta inválido.';
      return false;
    }
    if (!this.cardName.trim()) {
      this.errorPago = 'Ingresa el nombre del titular.';
      return false;
    }
    if (!/^\d{2}\/\d{2}$/.test(this.cardExpiry)) {
      this.errorPago = 'Fecha de vencimiento inválida. Formato: MM/AA.';
      return false;
    }
    if (this.cardCvc.length < 3) {
      this.errorPago = 'CVV inválido.';
      return false;
    }
    if (!this.cardDocNum.trim()) {
      this.errorPago = 'Ingresa tu número de documento.';
      return false;
    }
    return true;
  }

  private cargarSdkMP(): Promise<void> {
    return new Promise((resolve, reject) => {
      if ((window as any).MercadoPago) { resolve(); return; }
      const script = document.createElement('script');
      script.src = 'https://sdk.mercadopago.com/js/v2';
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('No se pudo cargar el SDK de Mercado Pago. Verifica tu conexión.'));
      document.head.appendChild(script);
    });
  }

  private calcularTotalDePedido(p: Pedido): number {
    if (!p?.lineasPedido?.length) return 0;
    return p.lineasPedido.reduce((sum, lp) => {
      const adicionales = (lp.adicionales ?? []).reduce(
        (s, a) => s + (a.adicional?.price ?? 0), 0
      );
      return sum + ((lp.comida?.price ?? 0) + adicionales) * (lp.cantidad ?? 0);
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
