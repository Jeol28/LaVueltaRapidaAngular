import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';
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

  cardNumber = '';
  cardExpiry = '';
  cardCvc = '';
  cardName = '';
  cardDocType = '';
  cardDocNum = '';
  installments: number | null = null;

  cardNumberValid = false;
  expirationDateValid = false;
  securityCodeValid = false;

  private mpCardNumberField: any = null;
  private mpExpirationDateField: any = null;
  private mpSecurityCodeField: any = null;

  private detectedPaymentMethodId = '';
  cardPaymentMethodId = '';
  private binLookupTimer: any = null;

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

  cardBrand = '';

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

  // ── B) Tarjeta directa (Checkout API) ────────────────────────────────────

  irAFormularioTarjeta(): void {
    this.errorPago = '';
    this.pasoPrevio = 'seleccion';
    this.paso = 'tarjeta';
    this.cargarSdkMP().then(() => {
      if (!this.mp) {
        this.mp = new (window as any).MercadoPago(MP_PUBLIC_KEY, { locale: 'es-CO' });
      }
    }).catch(() => {});
    setTimeout(() => this.initSecureFields(), 0);
  }

  async pagarConTarjeta(): Promise<void> {
    if (!this.validarFormularioTarjeta()) return;
    this.errorPago = '';

    try {
      await this.cargarSdkMP();
      if (!this.mp) {
        this.mp = new (window as any).MercadoPago(MP_PUBLIC_KEY, { locale: 'es-CO' });
      }

      const [expMonth, expYearShort] = this.cardExpiry.split('/');
      const expYear = expYearShort.length === 2 ? '20' + expYearShort : expYearShort;

      const cardToken = await this.mp.createCardToken({
        cardNumber:            this.cardNumber.replace(/\s/g, ''),
        cardholderName:        this.cardName.trim().toUpperCase(),
        cardExpirationMonth:   expMonth,
        cardExpirationYear:    expYear,
        securityCode:          this.cardCvc.trim(),
        identificationType:    this.cardDocType,
        identificationNumber:  this.cardDocNum.trim(),
      });

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
    if (!this.cvvValido) {
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

  get cvvValido(): boolean {
    const len = this.cardBrand === 'amex' ? 4 : 3;
    return this.cardCvc.trim().length >= len;
  }

  get formularioTarjetaCompleto(): boolean {
    return this.cardNumberValid
      && !!this.cardName.trim()
      && this.expirationDateValid
      && this.cvvValido
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

  // ── Formateo de campos de tarjeta ─────────────────────────────────────────

  onCardNumberInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const posSnap = input.selectionStart ?? 0;
    const rawSnap = input.value;

    // setTimeout garantiza que corremos DESPUÉS de que [(ngModel)] escriba el valor
    // crudo en el modelo, para que nuestra versión formateada sea la que gane.
    setTimeout(() => {
      const digitsBeforeCursor = rawSnap.slice(0, posSnap).replace(/\D/g, '').length;
      const digits = rawSnap.replace(/\D/g, '').slice(0, 16);
      const formatted = digits.match(/.{1,4}/g)?.join(' ') ?? digits;

      this.cardNumber = formatted;
      this.cardBrand = this.detectBrand(digits);
      this.cardNumberValid = digits.length >= 13;

      if (digits.length >= 6) {
        clearTimeout(this.binLookupTimer);
        this.binLookupTimer = setTimeout(async () => {
          try {
            if (!this.mp) return;
            const result = await this.mp.getPaymentMethods({ bin: digits.slice(0, 6) });
            const method = result?.results?.[0];
            if (method) {
              this.cardPaymentMethodId = method.id;
              this.detectedPaymentMethodId = method.id;
              if (this.esDebito) this.installments = 1;
            }
          } catch {}
        }, 400);
      } else {
        clearTimeout(this.binLookupTimer);
        this.cardPaymentMethodId = '';
        this.detectedPaymentMethodId = '';
      }

      // Segundo tick: Angular ya actualizó el DOM con el valor formateado.
      setTimeout(() => {
        if (digitsBeforeCursor === 0) { input.setSelectionRange(0, 0); return; }
        let count = 0;
        let newPos = formatted.length;
        for (let i = 0; i < formatted.length; i++) {
          if (formatted[i] !== ' ') count++;
          if (count === digitsBeforeCursor) { newPos = i + 1; break; }
        }
        input.setSelectionRange(newPos, newPos);
      });
    });
  }

  onCardNumberKeydown(event: KeyboardEvent): void {
    const input = event.target as HTMLInputElement;
    const start = input.selectionStart ?? 0;
    const end = input.selectionEnd ?? 0;

    if (start === end) {
      // Sin selección: saltar el separador
      if (event.key === 'Backspace' && start > 0 && input.value[start - 1] === ' ') {
        event.preventDefault();
        input.setSelectionRange(start - 1, start - 1);
      } else if (event.key === 'Delete' && input.value[start] === ' ') {
        event.preventDefault();
        input.setSelectionRange(start + 1, start + 1);
      }
    } else if (['Backspace', 'Delete'].includes(event.key)) {
      // Con selección: ampliar para no dejar la selección solo sobre el espacio
      const selected = input.value.slice(start, end);
      if (selected === ' ') {
        event.preventDefault();
      }
    }
  }

  onExpiryInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const posSnap = input.selectionStart ?? 0;
    const rawSnap = input.value;

    setTimeout(() => {
      const digitsBeforeCursor = rawSnap.slice(0, posSnap).replace(/\D/g, '').length;
      const digits = rawSnap.replace(/\D/g, '').slice(0, 4);
      const formatted = digits.length >= 2 ? digits.slice(0, 2) + '/' + digits.slice(2) : digits;

      this.cardExpiry = formatted;
      this.expirationDateValid = digits.length === 4;

      setTimeout(() => {
        let newPos = digitsBeforeCursor >= 2 ? digitsBeforeCursor + 1 : digitsBeforeCursor;
        newPos = Math.min(newPos, formatted.length);
        input.setSelectionRange(newPos, newPos);
      });
    });
  }

  onExpiryKeydown(event: KeyboardEvent): void {
    const input = event.target as HTMLInputElement;
    const start = input.selectionStart ?? 0;
    const end = input.selectionEnd ?? 0;

    if (start === end) {
      if (event.key === 'Backspace' && start > 0 && input.value[start - 1] === '/') {
        event.preventDefault();
        input.setSelectionRange(start - 1, start - 1);
      } else if (event.key === 'Delete' && input.value[start] === '/') {
        event.preventDefault();
        input.setSelectionRange(start + 1, start + 1);
      }
    } else if (['Backspace', 'Delete'].includes(event.key)) {
      const selected = input.value.slice(start, end);
      if (selected === '/') {
        event.preventDefault();
      }
    }
  }

  onCardNameKeydown(event: KeyboardEvent): void {
    if (event.ctrlKey || event.metaKey) return;
    if (event.key.length > 1) return; // teclas de control: Backspace, Delete, Tab, flechas…
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

  private detectBrand(digits: string): string {
    if (/^4/.test(digits)) return 'visa';
    if (/^(5[1-5]|2[2-7])/.test(digits)) return 'mastercard';
    if (/^3[47]/.test(digits)) return 'amex';
    if (/^3(?:0[0-5]|[68])/.test(digits)) return 'diners';
    return '';
  }

  private initSecureFields(): void {}
  private desmontarCamposMP(): void {}
}
