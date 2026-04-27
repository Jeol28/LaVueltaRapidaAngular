import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Cliente } from '../../models/cliente.model';
import { Pedido } from '../../models/pedido.model';
import { LineaPedido } from '../../models/linea-pedido.model';
import { EstadoPedido } from '../../models/estado-pedido.model';
import { ClienteService } from '../../services/cliente.service';
import { PedidoService } from '../../services/pedido.service';

type PedidosTab = 'activos' | 'pasados';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {

  cliente: Cliente | null = null;
  editMode: boolean = false;
  editForm: Partial<Cliente> = {};
  currentPassword: string = '';
  successMsg: boolean = false;
  errorMsg: string = '';

  showToastError: boolean = false;
  hideToastError: boolean = false;
  toastErrorMsg: string = '';

  pedidos: Pedido[] = [];
  pedidosTab: PedidosTab = 'activos';
  pedidoExpandidoId: number | null = null;
  cargandoPedidos: boolean = false;
  pedidosError: string = '';

  private readonly estadosActivos: EstadoPedido[] = ['RECIBIDO', 'COCINANDO', 'ENVIADO'];

  private scrollToPedidos = false;
  private expandirPedidoId: number | null = null;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private clienteService: ClienteService,
    private pedidoService: PedidoService
  ) {}

  ngOnInit(): void {
    this.scrollToPedidos = this.route.snapshot.fragment === 'mis-pedidos';
    const pedidoParam = this.route.snapshot.queryParamMap.get('pedido');
    this.expandirPedidoId = pedidoParam ? +pedidoParam : null;

    const username = localStorage.getItem('user');
    const role = localStorage.getItem('role');

    if (!username || role !== 'cliente') {
      this.router.navigate(['/login']);
      return;
    }

    this.clienteService.findByUsername(username).subscribe({
      next: cliente => {
        this.cliente = cliente ?? null;
        if (!this.cliente) {
          this.router.navigate(['/']);
          return;
        }
        this.cargarPedidos();
      },
      error: () => {
        this.router.navigate(['/']);
      }
    });
  }

  get initial(): string {
    return this.cliente?.name?.charAt(0).toUpperCase() ?? '?';
  }

  // ── Pedidos ──────────────────────────────────────────────────────────────
  cargarPedidos(): void {
    if (!this.cliente) return;
    this.cargandoPedidos = true;
    this.pedidosError = '';

    this.pedidoService.getByCliente(this.cliente.id).subscribe({
      next: pedidos => {
        this.pedidos = pedidos.sort(
          (a, b) => this.parseFecha(b.fechaCreacion) - this.parseFecha(a.fechaCreacion)
        );
        this.cargandoPedidos = false;
        if (this.expandirPedidoId) {
          this.pedidoExpandidoId = this.expandirPedidoId;
        }
        if (this.scrollToPedidos) {
          setTimeout(() => {
            document.getElementById('mis-pedidos')?.scrollIntoView({ behavior: 'smooth' });
          }, 50);
        }
      },
      error: () => {
        this.cargandoPedidos = false;
        this.pedidosError = 'No se pudieron cargar tus pedidos. Intenta de nuevo.';
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

  irAProducto(linea: LineaPedido): void {
    const adicionalesIds = linea.adicionales.map(lpa => lpa.adicional.id).join(',');
    const queryParams: Record<string, string | number> = { _r: Date.now() };
    if (adicionalesIds) queryParams['adicionales'] = adicionalesIds;
    this.router.navigate(['/producto', linea.comida.id], { queryParams });
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

  private triggerToastError(): void {
    this.showToastError = true;
    this.hideToastError = false;
    setTimeout(() => { this.hideToastError = true; },  3500);
    setTimeout(() => { this.showToastError = false; }, 4200);
  }

  private parseFecha(fecha: string | null | undefined): number {
    if (!fecha) return 0;
    const t = Date.parse(fecha);
    return isNaN(t) ? 0 : t;
  }

  // ── Edición de perfil ───────────────────────────────────────────────────
  enterEditMode(): void {
    if (!this.cliente) return;
    this.editForm = { ...this.cliente };
    this.currentPassword = '';
    this.editMode = true;
    this.successMsg = false;
    this.errorMsg = '';
  }

  cancelEdit(): void {
    this.editMode = false;
    this.currentPassword = '';
    this.errorMsg = '';
  }

  saveChanges(): void {
    if (!this.cliente) return;

    if (!this.currentPassword) {
      this.errorMsg = 'Debes ingresar tu contraseña actual.';
      return;
    }

    const payload: Partial<Cliente> = { ...this.editForm };
    if (!payload.password) {
      delete payload.password;
    }
    payload.currentPassword = this.currentPassword;

    this.clienteService.update(this.cliente!.id, payload).subscribe({
      next: updated => {
        this.cliente = updated;
        localStorage.setItem('user', this.cliente.username);
        window.dispatchEvent(new CustomEvent('userChanged'));

        this.editMode = false;
        this.currentPassword = '';
        this.successMsg = true;
        this.errorMsg = '';

        setTimeout(() => { this.successMsg = false; }, 4000);
      },
      error: err => {
        this.errorMsg = err?.error?.message
          ?? err?.error?.error
          ?? (typeof err?.error === 'string' ? err.error : null)
          ?? 'No se pudieron guardar los cambios. Intenta de nuevo.';
      }
    });
  }

  deleteAccount(): void {
    const confirmed = window.confirm(
      '¿Seguro que deseas eliminar tu cuenta? Esta acción no se puede deshacer.'
    );
    if (!confirmed || !this.cliente) return;

    this.clienteService.delete(this.cliente.id).subscribe({
      next: () => {
        localStorage.removeItem('user');
        localStorage.removeItem('role');
        localStorage.removeItem('clienteId');
        localStorage.removeItem('carritoId');
        this.router.navigate(['/']);
      },
      error: err => {
        this.toastErrorMsg = err?.error?.message
          ?? err?.error?.error
          ?? (typeof err?.error === 'string' ? err.error : null)
          ?? 'No se pudo eliminar la cuenta. Intenta de nuevo.';
        this.triggerToastError();
      }
    });
  }
}
