import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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

  pedidos: Pedido[] = [];
  pedidosTab: PedidosTab = 'activos';
  pedidoExpandidoId: number | null = null;
  cargandoPedidos: boolean = false;
  pedidosError: string = '';

  private readonly estadosActivos: EstadoPedido[] = ['RECIBIDO', 'COCINANDO', 'ENVIADO'];

  constructor(
    private router: Router,
    private clienteService: ClienteService,
    private pedidoService: PedidoService
  ) {}

  ngOnInit(): void {
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

    this.clienteService.isUsernameTaken(this.editForm.username!, this.cliente.id).subscribe({
      next: taken => {
        if (taken) {
          this.errorMsg = 'Ese nombre de usuario ya está en uso.';
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
            if (err?.status === 401 || err?.status === 403) {
              this.errorMsg = 'La contraseña actual es incorrecta.';
            } else {
              this.errorMsg = 'No se pudieron guardar los cambios. Intenta de nuevo.';
            }
          }
        });
      },
      error: () => {
        this.errorMsg = 'No se pudo verificar el nombre de usuario.';
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
      error: () => {
        this.errorMsg = 'No se pudo eliminar la cuenta. Intenta de nuevo.';
      }
    });
  }
}
