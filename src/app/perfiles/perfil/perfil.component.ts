import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Cliente } from '../../models/cliente.model';
import { Administrador } from '../../models/administrador.model';
import { Operador } from '../../models/operador.model';
import { Pedido } from '../../models/pedido.model';
import { LineaPedido } from '../../models/linea-pedido.model';
import { EstadoPedido } from '../../models/estado-pedido.model';
import { AuthService, MeResponse } from '../../services/auth.service';
import { ClienteService } from '../../services/cliente.service';
import { AdminService } from '../../services/admin.service';
import { OperadorService } from '../../services/operador.service';
import { PedidoService } from '../../services/pedido.service';

type PedidosTab = 'activos' | 'pasados';

interface EditFormData {
  name?: string; apellido?: string; email?: string; username?: string;
  password?: string; direccion?: string; telefono?: string;
  usuario?: string; contrasena?: string; nombre?: string;
}

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {

  meData: MeResponse | null = null;
  editMode = false;
  editForm: EditFormData = {};
  currentPassword = '';
  successMsg = false;
  errorMsg = '';

  showPassword = false;
  showCurrentPassword = false;

  showToastError = false;
  hideToastError = false;
  toastErrorMsg = '';

  pedidos: Pedido[] = [];
  pedidosTab: PedidosTab = 'activos';
  pedidoExpandidoId: number | null = null;
  cargandoPedidos = false;
  pedidosError = '';

  private readonly estadosActivos: EstadoPedido[] = ['RECIBIDO', 'COCINANDO', 'ENVIADO'];
  private scrollToPedidos = false;
  private expandirPedidoId: number | null = null;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private clienteService: ClienteService,
    private adminService: AdminService,
    private operadorService: OperadorService,
    private pedidoService: PedidoService
  ) {}

  ngOnInit(): void {
    this.scrollToPedidos = this.route.snapshot.fragment === 'mis-pedidos';
    const pedidoParam = this.route.snapshot.queryParamMap.get('pedido');
    this.expandirPedidoId = pedidoParam ? +pedidoParam : null;

    if (!localStorage.getItem('user') || !localStorage.getItem('role')) {
      this.router.navigate(['/login']);
      return;
    }

    this.authService.getMe().subscribe({
      next: data => {
        this.meData = data;
        if (data.role === 'cliente') this.cargarPedidos();
      },
      error: () => this.router.navigate(['/'])
    });
  }

  get initial(): string {
    if (!this.meData) return '?';
    const src = this.meData.name || this.meData.username;
    return src?.charAt(0).toUpperCase() ?? '?';
  }

  // ── Pedidos (solo cliente) ────────────────────────────────────────────────
  cargarPedidos(): void {
    if (!this.meData) return;
    this.cargandoPedidos = true;
    this.pedidosError = '';
    this.pedidoService.getByCliente(this.meData.id).subscribe({
      next: pedidos => {
        this.pedidos = pedidos.sort(
          (a, b) => this.parseFecha(b.fechaCreacion) - this.parseFecha(a.fechaCreacion)
        );
        this.cargandoPedidos = false;
        if (this.expandirPedidoId) this.pedidoExpandidoId = this.expandirPedidoId;
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

  cambiarTab(tab: PedidosTab): void { this.pedidosTab = tab; this.pedidoExpandidoId = null; }
  get pedidosActivos(): Pedido[] { return this.pedidos.filter(p => this.estadosActivos.includes(p.estado)); }
  get pedidosPasados(): Pedido[] { return this.pedidos.filter(p => p.estado === 'ENTREGADO'); }
  get pedidosVisibles(): Pedido[] { return this.pedidosTab === 'activos' ? this.pedidosActivos : this.pedidosPasados; }

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

  formatCOP(value: number): string { return value.toLocaleString('es-CO'); }

  formatFecha(fecha: string | null | undefined): string {
    if (!fecha) return '—';
    const ms = this.parseFecha(fecha);
    if (!ms) return fecha;
    const d = new Date(ms);
    return d.toLocaleString('es-CO', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  }

  getEstadoClass(estado: EstadoPedido): string {
    const mapa: Record<EstadoPedido, string> = {
      RECIBIDO: 'estado-recibido', COCINANDO: 'estado-cocinando',
      ENVIADO: 'estado-enviado', ENTREGADO: 'estado-entregado', CANCELADO: 'estado-cancelado'
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
    if (metodoPago === 'MP_ONLINE' && mpMethod) return this.mapMpMethod(mpMethod, mpType);
    const mapa: Record<string, string> = {
      MP_ONLINE: 'Mercado Pago', TARJETA: 'Tarjeta', EFECTIVO: 'Efectivo',
      DATAFONO: 'Datáfono', NEQUI: 'Nequi', DAVIPLATA: 'Daviplata',
      TRANSFERENCIA: 'Transferencia', LLAVE: 'Llave en mano'
    };
    return metodoPago ? (mapa[metodoPago] ?? metodoPago) : '—';
  }

  private mapMpMethod(method: string, type?: string): string {
    const m = method.toLowerCase();
    const t = (type ?? '').toLowerCase();
    if (m === 'visa') return t === 'debit_card' ? 'Visa débito' : 'Visa crédito';
    if (m === 'master' || m === 'mastercard') return t === 'debit_card' ? 'Mastercard débito' : 'Mastercard crédito';
    if (m === 'amex') return 'American Express';
    if (m === 'efecty') return 'Efecty';
    if (m === 'pse') return 'PSE';
    if (m === 'nequi') return 'Nequi';
    if (m === 'daviplata') return 'Daviplata';
    if (m === 'account_money') return 'Saldo MP';
    if (t === 'credit_card') return 'Tarjeta crédito';
    if (t === 'debit_card') return 'Tarjeta débito';
    if (t === 'ticket') return 'Pago en efectivo';
    if (t === 'bank_transfer') return 'Transferencia bancaria';
    return 'Mercado Pago';
  }

  private triggerToastError(): void {
    this.showToastError = true;
    this.hideToastError = false;
    setTimeout(() => { this.hideToastError = true; }, 3500);
    setTimeout(() => { this.showToastError = false; }, 4200);
  }

  private parseFecha(fecha: string | null | undefined): number {
    if (!fecha) return 0;
    const t = Date.parse(fecha);
    return isNaN(t) ? 0 : t;
  }

  // ── Edición ────────────────────────────────────────────────────────────────
  enterEditMode(): void {
    if (!this.meData) return;
    const r = this.meData;
    if (r.role === 'cliente') {
      this.editForm = { name: r.name, apellido: r.apellido, email: r.email, username: r.username, direccion: r.direccion, telefono: r.telefono };
    } else if (r.role === 'admin') {
      this.editForm = { usuario: r.username };
    } else {
      this.editForm = { nombre: r.name, usuario: r.username };
    }
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

  private onSaveSuccess(newUsername: string): void {
    this.meData!.username = newUsername;
    localStorage.setItem('user', newUsername);
    window.dispatchEvent(new CustomEvent('userChanged'));
    this.editMode = false;
    this.currentPassword = '';
    this.successMsg = true;
    this.errorMsg = '';
    setTimeout(() => { this.successMsg = false; }, 4000);
  }

  private onSaveError(err: any): void {
    this.errorMsg = err?.error?.message
      ?? err?.error?.error
      ?? (typeof err?.error === 'string' ? err.error : null)
      ?? 'No se pudieron guardar los cambios. Intenta de nuevo.';
  }

  saveChanges(): void {
    if (!this.meData) return;
    if (!this.currentPassword) {
      this.errorMsg = 'Debes ingresar tu contraseña actual.';
      return;
    }

    const role = this.meData.role;

    if (role === 'cliente') {
      const payload: Partial<Cliente> = {
        name: this.editForm.name,
        apellido: this.editForm.apellido,
        email: this.editForm.email,
        username: this.editForm.username,
        direccion: this.editForm.direccion,
        telefono: this.editForm.telefono,
        currentPassword: this.currentPassword
      };
      if (this.editForm.password) payload.password = this.editForm.password;
      this.clienteService.update(this.meData.id, payload).subscribe({
        next: updated => {
          if (this.meData) {
            this.meData.name = updated.name;
            this.meData.apellido = updated.apellido;
            this.meData.email = updated.email;
            this.meData.direccion = updated.direccion;
            this.meData.telefono = updated.telefono;
          }
          this.onSaveSuccess(updated.username);
        },
        error: err => this.onSaveError(err)
      });
    } else if (role === 'admin') {
      const payload: Partial<Administrador> = {
        usuario: this.editForm.usuario,
        currentPassword: this.currentPassword
      };
      if (this.editForm.contrasena) payload.contrasena = this.editForm.contrasena;
      this.adminService.update(this.meData.id, payload).subscribe({
        next: (updated: Administrador) => this.onSaveSuccess(updated.usuario),
        error: (err: any) => this.onSaveError(err)
      });
    } else {
      const payload: Partial<Operador> = {
        nombre: this.editForm.nombre,
        usuario: this.editForm.usuario,
        currentPassword: this.currentPassword
      };
      if (this.editForm.contrasena) payload.contrasena = this.editForm.contrasena;
      this.operadorService.update(this.meData.id, payload).subscribe({
        next: (updated: Operador) => {
          if (this.meData) this.meData.name = updated.nombre;
          this.onSaveSuccess(updated.usuario);
        },
        error: (err: any) => this.onSaveError(err)
      });
    }
  }

  deleteAccount(): void {
    if (this.meData?.role !== 'cliente') return;
    const confirmed = window.confirm('¿Seguro que deseas eliminar tu cuenta? Esta acción no se puede deshacer.');
    if (!confirmed) return;
    this.clienteService.delete(this.meData.id).subscribe({
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
