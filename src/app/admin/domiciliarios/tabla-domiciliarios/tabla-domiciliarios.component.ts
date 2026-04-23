import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Domiciliario } from '../../../models/domiciliario.model';
import { DomiciliarioService } from '../../../services/domiciliario.service';

@Component({
  selector: 'app-tabla-domiciliarios',
  templateUrl: './tabla-domiciliarios.component.html',
  styleUrls: ['./tabla-domiciliarios.component.css']
})
export class TablaDomiciliariosComponent implements OnInit {

  domiciliarios: Domiciliario[] = [];

  successMsg: string = '';
  showSuccess: boolean = false;
  hideSuccess: boolean = false;

  showError: boolean = false;
  hideError: boolean = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private domiciliarioService: DomiciliarioService
  ) {}

  ngOnInit(): void {
    this.loadDomiciliarios();

    this.route.queryParams.subscribe(params => {
      const success = params['success'];
      const error   = params['error'];

      if (success === 'added')   { this.successMsg = '¡Domiciliario agregado exitosamente!';   this.triggerSuccess(); }
      if (success === 'updated') { this.successMsg = '¡Domiciliario modificado exitosamente!'; this.triggerSuccess(); }
      if (success === 'deleted') { this.successMsg = '¡Domiciliario eliminado correctamente!'; this.triggerSuccess(); }
      if (error != null)         { this.triggerError(); }
    });
  }

  private loadDomiciliarios(): void {
    this.domiciliarioService.getAll().subscribe(domiciliarios => {
      this.domiciliarios = domiciliarios;
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

  eliminarDomiciliario(event: Event, id: number): void {
    event.stopPropagation();
    if (confirm('¿Seguro que quieres eliminar este domiciliario?')) {
      this.domiciliarioService.delete(id).subscribe({
        next: () => {
          this.loadDomiciliarios();
          this.successMsg = '¡Domiciliario eliminado correctamente!';
          this.triggerSuccess();
        },
        error: () => this.triggerError()
      });
    }
  }
}
