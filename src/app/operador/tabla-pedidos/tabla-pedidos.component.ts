import { Component, OnInit } from '@angular/core';
import { Pedido } from '../../models/pedido.model';
import { EstadoPedido } from '../../models/estado-pedido.model';
import { LineaPedido } from '../../models/linea-pedido.model';
import { PedidoService } from '../../services/pedido.service';

@Component({
  selector: 'app-tabla-pedidos',
  templateUrl: './tabla-pedidos.component.html',
  styleUrls: ['./tabla-pedidos.component.css']
})
export class TablaPedidosComponent implements OnInit {

  pedidos: Pedido[] = [];

  private readonly SECUENCIA: EstadoPedido[] = ['RECIBIDO', 'COCINANDO', 'ENVIADO', 'ENTREGADO'];
  private readonly METODOS_CONTRAENTREGA = ['EFECTIVO', 'DATAFONO', 'NEQUI', 'DAVIPLATA', 'TRANSFERENCIA', 'LLAVE'];

  puedePagar(pedido: Pedido): boolean {
    return pedido.estado === 'ENVIADO' &&
           this.METODOS_CONTRAENTREGA.includes(pedido.metodoPago ?? '') &&
           pedido.estadoPago !== 'APROBADO';
  }

  marcarComoPagado(pedido: Pedido): void {
    this.pedidoService.confirmarPago(pedido.id).subscribe({
      next: actualizado => {
        pedido.estadoPago = actualizado.estadoPago;
        pedido.fechaPago  = actualizado.fechaPago;
        pedido.totalPagado = actualizado.totalPagado;
        if (this.pedidoSeleccionado?.id === pedido.id) {
          this.pedidoSeleccionado = { ...this.pedidoSeleccionado, ...actualizado };
        }
        this.successMsg = `Pedido #${pedido.id} marcado como pagado`;
        this.triggerSuccess();
      },
      error: err => {
        this.errorMsg =
          err?.error?.error ?? err?.error?.message ??
          (typeof err?.error === 'string' ? err.error : null) ??
          'No se pudo confirmar el pago.';
        this.triggerError();
      }
    });
  }

  getEstadosPermitidos(pedido: Pedido): EstadoPedido[] {
    const idx = this.SECUENCIA.indexOf(pedido.estado);
    const opciones = idx === -1 ? [pedido.estado] : this.SECUENCIA.slice(idx, idx + 2);
    if (pedido.estadoPago !== 'APROBADO') {
      return opciones.filter(e => e !== 'ENTREGADO');
    }
    return opciones;
  }

  pedidoSeleccionado: Pedido | null = null;

  showSuccess: boolean = false;
  hideSuccess: boolean = false;
  showError: boolean = false;
  hideError: boolean = false;
  successMsg: string = '';
  errorMsg: string = 'No se pudo actualizar el estado.';

  constructor(private pedidoService: PedidoService) {}

  ngOnInit(): void {
    this.loadPedidos();
  }

  loadPedidos(): void {
    this.pedidoService.getActivos().subscribe({
      next: pedidos => this.pedidos = pedidos,
      error: () => this.triggerError()
    });
  }

  verDetalle(pedido: Pedido): void {
    this.pedidoSeleccionado = pedido;
  }

  cerrarDetalle(): void {
    this.pedidoSeleccionado = null;
  }

  calcularTotal(pedido: Pedido): number {
    return pedido.lineasPedido.reduce((total, linea) => {
      const precioBase = linea.comida.price * linea.cantidad;
      const precioAdicionales = linea.adicionales.reduce(
        (s, lpa) => s + lpa.adicional.price, 0
      ) * linea.cantidad;
      return total + precioBase + precioAdicionales;
    }, 0);
  }

  calcularSubtotalLinea(linea: LineaPedido): number {
    const base = linea.comida.price;
    const adics = linea.adicionales.reduce((s, lpa) => s + lpa.adicional.price, 0);
    return (base + adics) * linea.cantidad;
  }

  formatCOP(value: number): string {
    return value.toLocaleString('es-CO');
  }

  cambiarEstado(pedido: Pedido, nuevoEstado: EstadoPedido, selectEl?: HTMLSelectElement): void {
    const estadoPrevio = pedido.estado;

    this.pedidoService.updateEstado(pedido.id, nuevoEstado).subscribe({
      next: actualizado => {
        if (actualizado.estado === 'ENTREGADO') {
          this.pedidos = this.pedidos.filter(p => p.id !== pedido.id);
          if (this.pedidoSeleccionado?.id === pedido.id) {
            this.pedidoSeleccionado = null;
          }
        } else {
          pedido.estado = actualizado.estado;
          pedido.domiciliario = actualizado.domiciliario;
          pedido.fechaEntrega = actualizado.fechaEntrega;
          if (this.pedidoSeleccionado?.id === pedido.id) {
            this.pedidoSeleccionado = { ...this.pedidoSeleccionado, ...actualizado };
          }
        }
        this.successMsg = `Pedido #${pedido.id} → ${actualizado.estado}`;
        this.triggerSuccess();
      },
      error: err => {
        if (selectEl) {
          selectEl.value = estadoPrevio;
        }
        this.errorMsg = this.mensajeErrorEstado(err, nuevoEstado);
        this.triggerError();
      }
    });
  }

  private mensajeErrorEstado(err: any, nuevoEstado: EstadoPedido): string {
    const backendMsg: string | undefined =
      err?.error?.message ?? err?.error?.error ?? (typeof err?.error === 'string' ? err.error : undefined);

    if (backendMsg) return backendMsg;

    if (nuevoEstado === 'ENVIADO') {
      return 'No hay domiciliarios disponibles para asignar al pedido.';
    }
    return 'No se pudo actualizar el estado del pedido.';
  }

  getEstadoClass(estado: EstadoPedido): string {
    const mapa: Record<EstadoPedido, string> = {
      RECIBIDO:  'estado-recibido',
      COCINANDO: 'estado-cocinando',
      ENVIADO:   'estado-enviado',
      ENTREGADO: 'estado-entregado'
    };
    return mapa[estado] ?? '';
  }

  getEstadoPagoClass(estadoPago: string | undefined): string {
    const s = (estadoPago ?? '').toUpperCase();
    if (s === 'APROBADO') return 'pago-aprobado';
    if (s === 'EN_PROCESO') return 'pago-en-proceso';
    if (s === 'RECHAZADO') return 'pago-rechazado';
    return 'pago-pendiente';
  }

  getEstadoLabel(estadoPago: string | undefined): string {
    const s = (estadoPago ?? '').toUpperCase();
    if (s === 'APROBADO') return 'Pagado';
    if (s === 'EN_PROCESO') return 'En proceso';
    if (s === 'RECHAZADO') return 'Rechazado';
    return 'Pendiente';
  }

  getEstadoPagoLabel(estadoPago: string | undefined, metodoPago?: string, mpMethod?: string, mpType?: string): string {
    const s = (estadoPago ?? '').toUpperCase();
    let estado: string;
    if (s === 'APROBADO') estado = 'Pagado';
    else if (s === 'EN_PROCESO') estado = 'En proceso';
    else if (s === 'RECHAZADO') estado = 'Rechazado';
    else estado = 'Pendiente';
    const metodo = this.getMetodoPagoLabel(metodoPago, mpMethod, mpType);
    return metodo !== '—' ? `${estado} · ${metodo}` : estado;
  }

  getMetodoPagoLabel(metodoPago?: string, mpMethod?: string, mpType?: string): string {
    if (metodoPago === 'MP_ONLINE' && mpMethod) {
      return this.mapMpMethod(mpMethod, mpType);
    }
    const mapa: Record<string, string> = {
      MP_ONLINE: 'Mercado Pago', TARJETA: 'Tarjeta',
      EFECTIVO: 'Efectivo', DATAFONO: 'Datáfono',
      NEQUI: 'Nequi', DAVIPLATA: 'Daviplata',
      TRANSFERENCIA: 'Transferencia', LLAVE: 'Llave en mano'
    };
    return metodoPago ? (mapa[metodoPago] ?? metodoPago) : '—';
  }

  private mapMpMethod(method: string, type?: string): string {
    const m = method.toLowerCase();
    const t = (type ?? '').toLowerCase();
    if (m === 'visa')       return t === 'debit_card' ? 'Visa débito'        : 'Visa crédito';
    if (m === 'master' || m === 'mastercard') return t === 'debit_card' ? 'Mastercard débito' : 'Mastercard crédito';
    if (m === 'amex')       return 'American Express';
    if (m === 'efecty')     return 'Efecty';
    if (m === 'pse')        return 'PSE';
    if (m === 'nequi')      return 'Nequi';
    if (m === 'daviplata')  return 'Daviplata';
    if (m === 'account_money') return 'Saldo MP';
    if (t === 'credit_card')   return 'Tarjeta crédito';
    if (t === 'debit_card')    return 'Tarjeta débito';
    if (t === 'ticket')        return 'Pago en efectivo';
    if (t === 'bank_transfer') return 'Transferencia bancaria';
    return 'Mercado Pago';
  }

  private triggerSuccess(): void {
    this.showSuccess = true;
    this.hideSuccess = false;
    setTimeout(() => { this.hideSuccess = true; },  3500);
    setTimeout(() => { this.showSuccess = false; }, 4200);
  }

  private triggerError(): void {
    this.showError = true;
    this.hideError = false;
    setTimeout(() => { this.hideError = true; },  3500);
    setTimeout(() => { this.showError = false; }, 4200);
  }
}
