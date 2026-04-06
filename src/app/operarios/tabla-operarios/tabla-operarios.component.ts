import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Operador } from '../../models/operador.model';
import { OperadorService } from '../../services/operador.service';

@Component({
  selector: 'app-tabla-operarios',
  templateUrl: './tabla-operarios.component.html',
  styleUrls: ['./tabla-operarios.component.css']
})
export class TablaOperariosComponent implements OnInit {

  operadores: Operador[] = [];

  successMsg: string = '';
  showSuccess: boolean = false;
  hideSuccess: boolean = false;

  showError: boolean = false;
  hideError: boolean = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private operadorService: OperadorService
  ) {}

  ngOnInit(): void {
    this.operadores = this.operadorService.getAll();

    this.route.queryParams.subscribe(params => {
      const success = params['success'];
      const error   = params['error'];

      if (success === 'added')   { this.successMsg = '¡Operario agregado exitosamente!';   this.triggerSuccess(); }
      if (success === 'updated') { this.successMsg = '¡Operario modificado exitosamente!'; this.triggerSuccess(); }
      if (success === 'deleted') { this.successMsg = '¡Operario eliminado correctamente!'; this.triggerSuccess(); }
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

  eliminarOperario(event: Event, id: number): void {
    event.stopPropagation();
    if (confirm('¿Seguro que quieres eliminar este operario?')) {
      this.operadorService.delete(id);
      this.operadores = this.operadorService.getAll();
      this.successMsg = '¡Operario eliminado correctamente!';
      this.triggerSuccess();
    }
  }
}
