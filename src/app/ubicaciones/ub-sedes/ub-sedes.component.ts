import { Component, Input } from '@angular/core';
import { SedeUbicacion } from '../ubicaciones/ubicaciones.component';

@Component({
  selector: 'app-ub-sedes',
  templateUrl: './ub-sedes.component.html',
  styleUrls: ['./ub-sedes.component.css']
})
export class UbSedesComponent {
  @Input() sedes: SedeUbicacion[] = [];
}
