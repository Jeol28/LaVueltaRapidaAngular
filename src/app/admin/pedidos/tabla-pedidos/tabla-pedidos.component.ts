import { Component, OnInit } from '@angular/core';
import { Pedido } from '../../../models/pedido.model';
import { LineaPedido } from '../../../models/linea-pedido.model';
import { EstadoPedido } from '../../../models/estado-pedido.model';
import { PedidoService } from '../../../services/pedido.service';

type PedidosTab = 'activos' | 'pasados';

@Component({
  selector: 'app-tabla-pedidos-admin',
  templateUrl: './tabla-pedidos.component.html',
  styleUrls: ['./tabla-pedidos.component.css']
})
export class TablaPedidosAdminComponent implements OnInit {

  pedidos: Pedido[] = [];
  pedidosTab: PedidosTab = 'activos';
  pedidoExpandidoId: number | null = null;
  cargando: boolean = false;
  errorMsg: string = '';

  private readonly estadosActivos: EstadoPedido[] = ['RECIBIDO', 'COCINANDO', 'ENVIADO'];

  constructor(private pedidoService: PedidoService) {}

  ngOnInit(): void {
    this.cargarPedidos();
  }

  cargarPedidos(): void {
    this.cargando = true;
    this.errorMsg = '';
    this.pedidoService.getAll().subscribe({
      next: pedidos => {
        this.pedidos = pedidos;
        this.cargando = false;
      },
      error: () => {
        this.cargando = false;
        this.errorMsg = 'No se pudieron cargar los pedidos. Intenta de nuevo.';
      }
    });
  }

  cambiarTab(tab: PedidosTab): void {
    this.pedidosTab = tab;
    this.pedidoExpandidoId = null;
  }

  get pedidosActivos(): Pedido[] {
    return this.pedidos.filter(p => this.estadosActivos.includes(p.estado));
  }

  get pedidosPasados(): Pedido[] {
    return this.pedidos.filter(p => p.estado === 'ENTREGADO');
  }

  get pedidosVisibles(): Pedido[] {
    return this.pedidosTab === 'activos' ? this.pedidosActivos : this.pedidosPasados;
  }

  toggleDetalle(pedido: Pedido): void {
    this.pedidoExpandidoId = this.pedidoExpandidoId === pedido.id ? null : pedido.id;
  }

  calcularSubtotalLinea(linea: LineaPedido): number {
    const base = linea.comida.price;
    const adics = linea.adicionales.reduce((s, lpa) => s + lpa.adicional.price, 0);
    return (base + adics) * linea.cantidad;
  }

  calcularTotal(pedido: Pedido): number {
    return pedido.lineasPedido.reduce((sum, linea) => sum + this.calcularSubtotalLinea(linea), 0);
  }

  formatCOP(value: number): string {
    return value.toLocaleString('es-CO');
  }

  formatFecha(fecha: string | null | undefined): string {
    if (!fecha) return '—';
    const ms = this.parseFecha(fecha);
    if (!ms) return fecha;
    const d = new Date(ms);
    return d.toLocaleString('es-CO', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
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
      MP_ONLINE: 'Mercado Pago',
      TARJETA: 'Tarjeta',
      EFECTIVO: 'Efectivo',
      DATAFONO: 'Datáfono',
      NEQUI: 'Nequi',
      DAVIPLATA: 'Daviplata',
      TRANSFERENCIA: 'Transferencia',
      LLAVE: 'Llave en mano'
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

  nombreCliente(p: Pedido): string {
    if (!p.cliente) return '—';
    const apellido = p.cliente.apellido ?? '';
    return `${p.cliente.name ?? ''} ${apellido}`.trim() || '—';
  }

  private parseFecha(fecha: string | null | undefined): number {
    if (!fecha) return 0;
    const t = Date.parse(fecha);
    return isNaN(t) ? 0 : t;
  }
}
