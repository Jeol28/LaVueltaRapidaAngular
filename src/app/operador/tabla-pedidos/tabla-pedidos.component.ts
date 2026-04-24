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

  getEstadosPermitidos(actual: EstadoPedido): EstadoPedido[] {
    const idx = this.SECUENCIA.indexOf(actual);
    return idx === -1 ? [actual] : this.SECUENCIA.slice(idx, idx + 2);
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
      err?.error?.message ?? (typeof err?.error === 'string' ? err.error : undefined);

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
