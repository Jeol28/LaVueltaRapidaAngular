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
        this.pedidos = pedidos.sort(
          (a, b) => this.parseFecha(b.fechaCreacion) - this.parseFecha(a.fechaCreacion)
        );
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
