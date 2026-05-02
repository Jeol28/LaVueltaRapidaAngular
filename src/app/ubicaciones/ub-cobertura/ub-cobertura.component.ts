import { Component, Input } from '@angular/core';
import { ZonaCobertura } from '../ubicaciones/ubicaciones.component';

@Component({
  selector: 'app-ub-cobertura',
  templateUrl: './ub-cobertura.component.html',
  styleUrls: ['./ub-cobertura.component.css']
})
export class UbCoberturaComponent {
  @Input() zonas: ZonaCobertura[] = [];
}
