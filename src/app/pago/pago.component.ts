import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PedidoService } from '../services/pedido.service';
import { Pedido } from '../models/pedido.model';

type MetodoPago = 'tarjeta' | 'pse' | 'nequi' | 'daviplata';
type FasePago   = 'metodo' | 'datos' | 'procesando' | 'exito' | 'fallo';

interface BancoPSE {
  id: string;
  nombre: string;
}

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

  private destruido: boolean = false;
  private timerProcesando: any = null;
  private timerRedireccion: any = null;

  fase: FasePago = 'metodo';
  metodo: MetodoPago | null = null;

  numeroTarjeta: string = '';
  nombreTarjeta:  string = '';
  vencimiento:    string = '';
  cvv:            string = '';
  cuotas:         number = 1;

  bancosPse: BancoPSE[] = [
    { id: 'bancolombia', nombre: 'Bancolombia' },
    { id: 'davivienda',  nombre: 'Davivienda' },
    { id: 'bbva',        nombre: 'BBVA Colombia' },
    { id: 'bogota',      nombre: 'Banco de Bogotá' },
    { id: 'occidente',   nombre: 'Banco de Occidente' },
    { id: 'colpatria',   nombre: 'Scotiabank Colpatria' },
    { id: 'av-villas',   nombre: 'AV Villas' },
    { id: 'caja-social', nombre: 'Banco Caja Social' },
    { id: 'popular',     nombre: 'Banco Popular' },
    { id: 'nequi-bank',  nombre: 'Nequi' }
  ];
  bancoPse: string = '';

  numeroCelular: string = '';
  cedula:        string = '';

  errorMsg: string = '';
  refTransaccion: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private pedidoService: PedidoService
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
    if (this.timerProcesando) clearTimeout(this.timerProcesando);
    if (this.timerRedireccion) clearTimeout(this.timerRedireccion);
  }

  // ── Navegación de fases ──────────────────────────────────────────────────

  seleccionarMetodo(metodo: MetodoPago): void {
    this.metodo = metodo;
    this.errorMsg = '';
    this.fase = 'datos';
  }

  volverAMetodos(): void {
    this.fase = 'metodo';
    this.metodo = null;
    this.errorMsg = '';
  }

  pagar(): void {
    this.errorMsg = '';
    if (this.pedidoNoEncontrado) {
      this.errorMsg = 'No podemos procesar el pago: el pedido no fue verificado por el servidor.';
      return;
    }
    if (!this.validarDatos()) return;

    this.fase = 'procesando';

    this.timerProcesando = setTimeout(() => {
      if (this.destruido) return;
      const exito = Math.random() > 0.12;
      if (exito) {
        this.guardarPagoLocal(this.pedidoId, {
          ref: this.refTransaccion,
          metodo: this.metodo!,
          total: this.total,
          fecha: new Date().toISOString()
        });
        this.fase = 'exito';
        this.timerRedireccion = setTimeout(() => {
          if (!this.destruido) this.finalizar();
        }, 4500);
      } else {
        this.fase = 'fallo';
      }
    }, 2600);
  }

  reintentar(): void {
    if (this.timerProcesando) clearTimeout(this.timerProcesando);
    if (this.timerRedireccion) clearTimeout(this.timerRedireccion);
    this.fase = 'datos';
    this.errorMsg = '';
    this.refTransaccion = this.generarReferencia();
  }

  cancelar(): void {
    this.router.navigate(['/perfil'], { fragment: 'mis-pedidos' });
  }

  finalizar(): void {
    this.router.navigate(['/perfil'], {
      fragment: 'mis-pedidos',
      queryParams: { pedido: this.pedidoId }
    });
  }

  // ── Validación por método ────────────────────────────────────────────────

  private validarDatos(): boolean {
    if (this.metodo === 'tarjeta') {
      const num = this.numeroTarjeta.replace(/\s/g, '');
      if (num.length < 13 || num.length > 19) {
        this.errorMsg = 'Número de tarjeta inválido.';
        return false;
      }
      if (!this.nombreTarjeta.trim()) {
        this.errorMsg = 'Ingresa el nombre del titular.';
        return false;
      }
      if (!/^\d{2}\/\d{2}$/.test(this.vencimiento)) {
        this.errorMsg = 'Vencimiento debe ser MM/AA.';
        return false;
      }
      const [mmStr, yyStr] = this.vencimiento.split('/');
      const mm = +mmStr;
      const yy = +yyStr;
      if (mm < 1 || mm > 12) {
        this.errorMsg = 'El mes de vencimiento debe estar entre 01 y 12.';
        return false;
      }
      const ahora = new Date();
      const anioActual = ahora.getFullYear() % 100;
      const mesActual  = ahora.getMonth() + 1;
      if (yy < anioActual || (yy === anioActual && mm < mesActual)) {
        this.errorMsg = 'La tarjeta está vencida.';
        return false;
      }
      if (!/^\d{3,4}$/.test(this.cvv)) {
        this.errorMsg = 'CVV inválido.';
        return false;
      }
      return true;
    }
    if (this.metodo === 'pse') {
      if (!this.bancoPse) {
        this.errorMsg = 'Selecciona tu banco.';
        return false;
      }
      if (!/^\d{6,12}$/.test(this.cedula)) {
        this.errorMsg = 'Cédula inválida.';
        return false;
      }
      return true;
    }
    if (this.metodo === 'nequi' || this.metodo === 'daviplata') {
      if (!/^3\d{9}$/.test(this.numeroCelular)) {
        this.errorMsg = 'Ingresa un celular colombiano válido (10 dígitos, inicia en 3).';
        return false;
      }
      return true;
    }
    return false;
  }

  // ── Inputs con formato ───────────────────────────────────────────────────

  formatearTarjeta(event: Event): void {
    const input = event.target as HTMLInputElement;
    let val = input.value.replace(/\D/g, '').slice(0, 19);
    val = val.replace(/(.{4})/g, '$1 ').trim();
    this.numeroTarjeta = val;
    input.value = val;
  }

  formatearVencimiento(event: Event): void {
    const input = event.target as HTMLInputElement;
    let val = input.value.replace(/\D/g, '').slice(0, 4);
    if (val.length >= 3) val = val.slice(0, 2) + '/' + val.slice(2);
    this.vencimiento = val;
    input.value = val;
  }

  formatearCvv(event: Event): void {
    const input = event.target as HTMLInputElement;
    const val = input.value.replace(/\D/g, '').slice(0, 4);
    this.cvv = val;
    input.value = val;
  }

  formatearCelular(event: Event): void {
    const input = event.target as HTMLInputElement;
    const val = input.value.replace(/\D/g, '').slice(0, 10);
    this.numeroCelular = val;
    input.value = val;
  }

  formatearCedula(event: Event): void {
    const input = event.target as HTMLInputElement;
    const val = input.value.replace(/\D/g, '').slice(0, 12);
    this.cedula = val;
    input.value = val;
  }

  // ── Helpers ──────────────────────────────────────────────────────────────

  formatCOP(amount: number): string {
    return new Intl.NumberFormat('es-CO').format(amount);
  }

  get tarjetaTipo(): 'visa' | 'mastercard' | 'amex' | 'diners' | 'desconocida' {
    const num = this.numeroTarjeta.replace(/\s/g, '');
    if (num.startsWith('4')) return 'visa';
    if (/^5[1-5]/.test(num) || /^2[2-7]/.test(num)) return 'mastercard';
    if (/^3[47]/.test(num)) return 'amex';
    if (/^3(0[0-5]|[68])/.test(num)) return 'diners';
    return 'desconocida';
  }

  get nombreMetodo(): string {
    switch (this.metodo) {
      case 'tarjeta':   return 'Tarjeta de crédito / débito';
      case 'pse':       return 'PSE - Débito desde tu banco';
      case 'nequi':     return 'Nequi';
      case 'daviplata': return 'Daviplata';
      default:          return '';
    }
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

  private guardarPagoLocal(pedidoId: number, data: object): void {
    try {
      localStorage.setItem(`lvr-pedido-pago-${pedidoId}`, JSON.stringify(data));
    } catch {}
  }
}
