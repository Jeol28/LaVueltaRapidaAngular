import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PedidoService } from '../services/pedido.service';
import { PagoService } from '../services/pago.service';
import { Pedido } from '../models/pedido.model';

declare const MercadoPago: any;

const MP_PUBLIC_KEY = 'APP_USR-fab38766-e12d-410f-bbf5-b45ae76d48c0';

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

  cardName = '';
  cardDocType = '';
  cardDocNum = '';
  installments: number | null = null;

  cardBrand = '';
  cardLast4 = '';

  cardNumberValid = false;
  expirationDateValid = false;
  securityCodeValid = false;

  cardNumberFocus = false;
  cardExpiryFocus = false;
  cardCvcFocus = false;

  cardNumberError = false;
  cardExpiryError = false;
  cardCvcError = false;

  cardPaymentMethodId = '';
  private detectedPaymentMethodId = '';

  private mpCardNumberField: any = null;
  private mpExpirationDateField: any = null;
  private mpSecurityCodeField: any = null;

  readonly docTypeOptions = [
    { value: 'CC', label: 'CC' },
    { value: 'CE', label: 'CE' },
    { value: 'NIT', label: 'NIT' },
    { value: 'PP', label: 'Pasaporte' }
  ];

  private readonly allInstallmentOptions = [
    { value: 1,  label: '1 cuota (sin interés)' },
    { value: 3,  label: '3 cuotas' },
    { value: 6,  label: '6 cuotas' },
    { value: 12, label: '12 cuotas' },
    { value: 24, label: '24 cuotas' },
    { value: 36, label: '36 cuotas' }
  ];

  get esDebito(): boolean {
    const id = this.cardPaymentMethodId;
    return id.startsWith('deb') || id === 'maestro' || id === 'prepaid_card';
  }

  get installmentOptions(): { value: number; label: string }[] {
    return this.esDebito ? [this.allInstallmentOptions[0]] : this.allInstallmentOptions;
  }

  refTransaccion = '';
  private destruido = false;
  private mp: any = null;
  private pagesShowHandler!: (e: PageTransitionEvent) => void;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private pedidoService: PedidoService,
    private pagoService: PagoService,
    private ngZone: NgZone
  ) {}

  ngOnInit(): void {
    this.pagesShowHandler = (e: PageTransitionEvent) => {
      if (e.persisted) this.redirigiendo = false;
    };
    window.addEventListener('pageshow', this.pagesShowHandler);

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
    window.removeEventListener('pageshow', this.pagesShowHandler);
    this.desmontarCamposMP();
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
        description: lp.comida?.description ?? undefined,
        category_id: (lp.comida as any)?.category?.name
          ? (lp.comida as any).category.name.toLowerCase()
              .normalize('NFD').replace(/[̀-ͯ]/g, '')
              .replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '')
          : 'food',
        quantity: lp.cantidad ?? 1,
        unit_price: (lp.comida?.price ?? 0) + adicionales,
        currency_id: 'COP'
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

  // ── B) Tarjeta directa con Secure Fields (PCI Compliance) ────────────────

  irAFormularioTarjeta(): void {
    this.errorPago = '';
    this.pasoPrevio = 'seleccion';
    this.paso = 'tarjeta';
    this.cargarSdkMP().then(() => {
      if (!this.mp) {
        this.mp = new (window as any).MercadoPago(MP_PUBLIC_KEY, { locale: 'es-CO' });
      }
      setTimeout(() => this.initSecureFields(), 0);
    }).catch(() => {
      this.errorPago = 'No se pudo cargar el SDK de Mercado Pago. Verifica tu conexión.';
    });
  }

  async pagarConTarjeta(): Promise<void> {
    if (!this.validarFormularioTarjeta()) return;
    this.errorPago = '';

    try {
      if (!this.mp) {
        await this.cargarSdkMP();
        this.mp = new (window as any).MercadoPago(MP_PUBLIC_KEY, { locale: 'es-CO' });
      }

      // Tokenización vía Secure Fields: MP lee número/vencimiento/CVV
      // directamente desde sus iframes — nuestra app nunca los toca.
      const cardToken = await this.mp.fields.createCardToken({
        cardholderName:        this.cardName.trim().toUpperCase(),
        identificationType:    this.cardDocType,
        identificationNumber:  this.cardDocNum.trim(),
      });

      this.cardLast4 = cardToken.last_four_digits || this.cardLast4;
      this.pasoPrevio = 'tarjeta';
      this.paso = 'procesando';

      const pmId: string = cardToken.payment_method_id || this.cardPaymentMethodId || this.detectedPaymentMethodId;
      const cliente = this.pedido?.cliente;
      const payerEmail = cliente?.email?.trim() || localStorage.getItem('user') || '';

      if (!payerEmail) {
        this.errorPago = 'No encontramos un correo asociado a tu cuenta. Actualiza tu perfil e intenta de nuevo.';
        this.paso = 'error-pago';
        return;
      }

      this.pagoService.procesarPagoTarjeta({
        token: cardToken.id,
        transaction_amount: this.total,
        payment_method_id: pmId,
        installments: +this.installments!,
        payer: {
          email: payerEmail,
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
            this.errorPago = 'El pago no pudo confirmarse. Intenta de nuevo o elige otro método de pago.';
            this.paso = 'error-pago';
          } else {
            this.errorPago = this.mensajeRechazo(resp.status_detail);
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
      let msg = 'Error al generar el token de tarjeta. Verifica los datos e intenta nuevamente.';
      if (Array.isArray(err)) {
        msg = (err as any[]).map((e: any) => e.message || e.cause || e).join(' · ');
      } else if (err?.message) {
        msg = err.message;
      }
      this.errorPago = msg;
      this.pasoPrevio = 'tarjeta';
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
    this.desmontarCamposMP();
    this.paso = this.pasoPrevio;
    this.errorPago = '';
    if (this.paso === 'tarjeta') {
      this.pasoPrevio = 'seleccion';
      setTimeout(() => this.initSecureFields(), 0);
    }
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
    if (!this.cardNumberValid) {
      this.errorPago = 'Número de tarjeta inválido.';
      return false;
    }
    if (!this.cardName.trim()) {
      this.errorPago = 'Ingresa el nombre del titular.';
      return false;
    }
    if (!this.expirationDateValid) {
      this.errorPago = 'Fecha de vencimiento inválida.';
      return false;
    }
    if (!this.securityCodeValid) {
      this.errorPago = 'CVV inválido.';
      return false;
    }
    if (!this.cardDocType) {
      this.errorPago = 'Selecciona el tipo de documento.';
      return false;
    }
    if (!this.cardDocNum.trim()) {
      this.errorPago = 'Ingresa tu número de documento.';
      return false;
    }
    if (!this.installments) {
      this.errorPago = 'Selecciona el número de cuotas.';
      return false;
    }
    return true;
  }

  get formularioTarjetaCompleto(): boolean {
    return this.cardNumberValid
      && !!this.cardName.trim()
      && this.expirationDateValid
      && this.securityCodeValid
      && !!this.cardDocType
      && !!this.cardDocNum.trim()
      && !!this.installments;
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

  private initSecureFields(): void {
    if (!this.mp || !this.mp.fields) return;
    if (this.mpCardNumberField) return;

    const baseStyle = {
      color: '#ffffff',
      fontSize: '14px',
      fontFamily: 'JetBrains Mono, monospace',
      placeholderColor: '#666666'
    };

    try {
      this.mpCardNumberField = this.mp.fields
        .create('cardNumber', { placeholder: '0000 0000 0000 0000', style: baseStyle })
        .mount('mpCardNumber');

      this.mpExpirationDateField = this.mp.fields
        .create('expirationDate', { placeholder: 'MM/AA', style: baseStyle })
        .mount('mpExpirationDate');

      this.mpSecurityCodeField = this.mp.fields
        .create('securityCode', { placeholder: '•••', style: baseStyle })
        .mount('mpSecurityCode');

      this.bindFieldEvents(this.mpCardNumberField, 'cardNumber');
      this.bindFieldEvents(this.mpExpirationDateField, 'cardExpiry');
      this.bindFieldEvents(this.mpSecurityCodeField, 'cardCvc');

      this.mpCardNumberField.on('binChange', async (data: any) => {
        const bin = data?.bin;
        this.ngZone.run(async () => {
          if (!bin || bin.length < 6) {
            this.cardPaymentMethodId = '';
            this.detectedPaymentMethodId = '';
            this.cardBrand = '';
            return;
          }
          try {
            const result = await this.mp.getPaymentMethods({ bin });
            const method = result?.results?.[0];
            if (method) {
              this.cardPaymentMethodId = method.id;
              this.detectedPaymentMethodId = method.id;
              this.cardBrand = this.brandFromMethodId(method.id);
              if (this.esDebito) this.installments = 1;
            }
          } catch {}
        });
      });
    } catch (err) {
      console.error('Error montando Secure Fields de MP:', err);
    }
  }

  private bindFieldEvents(field: any, kind: 'cardNumber' | 'cardExpiry' | 'cardCvc'): void {
    if (!field) return;

    field.on('focus', () => this.ngZone.run(() => {
      if (kind === 'cardNumber') this.cardNumberFocus = true;
      if (kind === 'cardExpiry') this.cardExpiryFocus = true;
      if (kind === 'cardCvc')    this.cardCvcFocus = true;
    }));

    field.on('blur', () => this.ngZone.run(() => {
      if (kind === 'cardNumber') this.cardNumberFocus = false;
      if (kind === 'cardExpiry') this.cardExpiryFocus = false;
      if (kind === 'cardCvc')    this.cardCvcFocus = false;
    }));

    field.on('validityChange', (event: any) => this.ngZone.run(() => {
      const valid = !event?.errorMessages || event.errorMessages.length === 0;
      if (kind === 'cardNumber') {
        this.cardNumberValid = valid;
        this.cardNumberError = !valid;
      }
      if (kind === 'cardExpiry') {
        this.expirationDateValid = valid;
        this.cardExpiryError = !valid;
      }
      if (kind === 'cardCvc') {
        this.securityCodeValid = valid;
        this.cardCvcError = !valid;
      }
    }));
  }

  private desmontarCamposMP(): void {
    try { this.mpCardNumberField?.unmount(); } catch {}
    try { this.mpExpirationDateField?.unmount(); } catch {}
    try { this.mpSecurityCodeField?.unmount(); } catch {}
    this.mpCardNumberField = null;
    this.mpExpirationDateField = null;
    this.mpSecurityCodeField = null;
    this.cardNumberValid = false;
    this.expirationDateValid = false;
    this.securityCodeValid = false;
    this.cardNumberError = false;
    this.cardExpiryError = false;
    this.cardCvcError = false;
    this.cardBrand = '';
    this.cardLast4 = '';
    this.cardPaymentMethodId = '';
    this.detectedPaymentMethodId = '';
  }

  private brandFromMethodId(id: string): string {
    if (id.includes('visa')) return 'visa';
    if (id.includes('master')) return 'mastercard';
    if (id.includes('amex')) return 'amex';
    if (id.includes('diners')) return 'diners';
    return '';
  }

  onCardNameKeydown(event: KeyboardEvent): void {
    if (event.ctrlKey || event.metaKey) return;
    if (event.key.length > 1) return;
    if (!/^[a-zA-ZáéíóúüñÁÉÍÓÚÜÑàèìòùÀÈÌÒÙ ]$/.test(event.key)) {
      event.preventDefault();
    }
  }

  onCardNameInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const cleaned = input.value.replace(/[^a-zA-ZáéíóúüñÁÉÍÓÚÜÑàèìòùÀÈÌÒÙ ]/g, '');
    if (cleaned !== input.value) {
      const pos = input.selectionStart ?? 0;
      const removed = input.value.slice(0, pos).replace(/[^a-zA-ZáéíóúüñÁÉÍÓÚÜÑàèìòùÀÈÌÒÙ ]/g, '').length;
      this.cardName = cleaned;
      setTimeout(() => input.setSelectionRange(removed, removed));
    }
  }

  private mensajeRechazo(code: string): string {
    const mensajes: Record<string, string> = {
      cc_rejected_bad_filled_card_number:  'Número de tarjeta incorrecto. Revisa los datos.',
      cc_rejected_bad_filled_date:         'Fecha de vencimiento incorrecta.',
      cc_rejected_bad_filled_security_code:'CVV incorrecto.',
      cc_rejected_bad_filled_other:        'Datos de tarjeta incorrectos.',
      cc_rejected_blacklist:               'No podemos procesar pagos con esta tarjeta.',
      cc_rejected_call_for_authorize:      'Debes autorizar este pago desde la app o web de tu banco antes de continuar.',
      cc_rejected_card_disabled:           'Tu tarjeta está inactiva. Contáctate con tu banco.',
      cc_rejected_card_error:              'No pudimos procesar tu pago. Intenta de nuevo.',
      cc_rejected_duplicated_payment:      'Ya realizaste un pago igual recientemente. Espera unos minutos.',
      cc_rejected_high_risk:               'Tu banco rechazó el pago por seguridad. Intenta con otra tarjeta o autoriza la operación desde tu banco.',
      cc_rejected_insufficient_amount:     'Fondos insuficientes en la tarjeta.',
      cc_rejected_invalid_installments:    'Esta tarjeta no acepta el número de cuotas seleccionado.',
      cc_rejected_max_attempts:            'Superaste el límite de intentos. Intenta mañana.',
      cc_rejected_other_reason:            'Tu pago no fue procesado. Intenta con otra tarjeta.',
    };
    return mensajes[code] ?? `Pago rechazado (${code}). Verifica los datos o intenta con otra tarjeta.`;
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
