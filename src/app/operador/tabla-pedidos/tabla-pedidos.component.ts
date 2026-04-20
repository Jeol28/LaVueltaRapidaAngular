import { Component, OnInit } from '@angular/core';
import { Pedido } from '../../models/pedido.model';
import { EstadoPedido } from '../../models/estado-pedido.model';
import { PedidoService } from '../../services/pedido.service';

@Component({
  selector: 'app-tabla-pedidos',
  templateUrl: './tabla-pedidos.component.html',
  styleUrls: ['./tabla-pedidos.component.css']
})
export class TablaPedidosComponent implements OnInit {

  pedidos: Pedido[] = [];
  estados: EstadoPedido[] = ['RECIBIDO', 'COCINANDO', 'ENVIADO', 'ENTREGADO'];

  showSuccess: boolean = false;
  hideSuccess: boolean = false;
  showError: boolean = false;
  hideError: boolean = false;
  successMsg: string = '';

  constructor(private pedidoService: PedidoService) {}

  ngOnInit(): void {
    this.loadPedidos();
  }

  loadPedidos(): void {
    this.pedidoService.getAll().subscribe({
      next: pedidos => this.pedidos = pedidos,
      error: () => this.triggerError()
    });
  }

  cambiarEstado(pedido: Pedido, nuevoEstado: EstadoPedido): void {
    this.pedidoService.updateEstado(pedido.id, nuevoEstado).subscribe({
      next: actualizado => {
        pedido.estado = actualizado.estado;
        this.successMsg = `Pedido #${pedido.id} → ${actualizado.estado}`;
        this.triggerSuccess();
      },
      error: () => this.triggerError()
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
