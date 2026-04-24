import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DomiciliarioService } from '../../../services/domiciliario.service';
import { PedidoService } from '../../../services/pedido.service';

@Component({
  selector: 'app-add-domiciliario',
  templateUrl: './add-domiciliario.component.html',
  styleUrls: ['./add-domiciliario.component.css']
})
export class AddDomiciliarioComponent implements OnInit {

  editMode: boolean = false;
  editId: number | null = null;
  entregandoPedido: boolean = false;
  errorMsg: string = '';

  domiciliario = {
    nombre: '',
    cedula: '',
    celular: '',
    disponible: true
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private domiciliarioService: DomiciliarioService,
    private pedidoService: PedidoService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.editMode = true;
      this.editId = +id;
      this.domiciliarioService.getById(+id).subscribe({
        next: found => {
          this.domiciliario = {
            nombre: found.nombre,
            cedula: found.cedula,
            celular: found.celular,
            disponible: found.disponible
          };
          this.pedidoService.getActivos().subscribe({
            next: pedidos => {
              this.entregandoPedido = pedidos.some(
                p => p.estado === 'ENVIADO' && p.domiciliario?.id === found.id
              );
            }
          });
        },
        error: () => {
          this.router.navigate(['/admin/domiciliarios'], { queryParams: { error: 'notfound' } });
        }
      });
    }
  }

  onSubmit(): void {
    if (this.editMode && this.entregandoPedido && this.domiciliario.disponible) {
      this.errorMsg = 'Este domiciliario está en entrega activa y no puede marcarse como disponible.';
      return;
    }
    this.errorMsg = '';

    if (this.editMode && this.editId !== null) {
      this.domiciliarioService.update(this.editId, this.domiciliario).subscribe({
        next: () => this.router.navigate(['/admin/domiciliarios'], { queryParams: { success: 'updated' } }),
        error: err => { this.errorMsg = this.extractError(err, 'No se pudo guardar los cambios. Intenta de nuevo.'); }
      });
    } else {
      this.domiciliarioService.add(this.domiciliario).subscribe({
        next: () => this.router.navigate(['/admin/domiciliarios'], { queryParams: { success: 'added' } }),
        error: err => { this.errorMsg = this.extractError(err, 'No se pudo agregar el domiciliario. Intenta de nuevo.'); }
      });
    }
  }

  private extractError(err: any, fallback: string): string {
    return err?.error?.message
      ?? err?.error?.error
      ?? (typeof err?.error === 'string' ? err.error : null)
      ?? fallback;
  }
}
