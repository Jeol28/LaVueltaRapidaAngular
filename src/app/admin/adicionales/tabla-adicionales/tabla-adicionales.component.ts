import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Adicional } from '../../../models/adicional.model';
import { AdicionalService } from '../../../services/adicional.service';

@Component({
  selector: 'app-tabla-adicionales',
  templateUrl: './tabla-adicionales.component.html',
  styleUrls: ['./tabla-adicionales.component.css']
})
export class TablaAdicionalesComponent implements OnInit {

  adicionales: Adicional[] = [];

  successMsg: string = '';
  showSuccess: boolean = false;
  hideSuccess: boolean = false;

  errorMsg: string = '';
  showError: boolean = false;
  hideError: boolean = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private adicionalService: AdicionalService
  ) {}

  ngOnInit(): void {
    this.loadAdicionales();

    this.route.queryParams.subscribe(params => {
      const success = params['success'];
      const error   = params['error'];

      if (success === 'added')   { this.successMsg = '¡Adicional agregado exitosamente!';   this.triggerSuccess(); }
      if (success === 'updated') { this.successMsg = '¡Adicional modificado exitosamente!'; this.triggerSuccess(); }
      if (success === 'deleted') { this.successMsg = '¡Adicional eliminado correctamente!'; this.triggerSuccess(); }
      if (error != null)         { this.triggerError(); }
    });
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

  private loadAdicionales(): void {
    this.adicionalService.getAll().subscribe(adicionales => {
      this.adicionales = adicionales;
    });
  }

  eliminarAdicional(event: Event, id: number): void {
    event.stopPropagation();
    if (confirm('¿Seguro que quieres eliminar este adicional?')) {
      this.adicionalService.delete(id).subscribe({
        next: () => {
          this.loadAdicionales();
          this.successMsg = '¡Adicional eliminado correctamente!';
          this.triggerSuccess();
        },
        error: err => {
          this.errorMsg = err?.error?.message
            ?? err?.error?.error
            ?? (typeof err?.error === 'string' ? err.error : null)
            ?? 'No se pudo eliminar el adicional.';
          this.triggerError();
        }
      });
    }
  }
}
