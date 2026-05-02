import { Component, Input } from '@angular/core';
import { ZonaCobertura } from '../ubicaciones/ubicaciones.component';

@Component({
  selector: 'app-ub-zona-card',
  templateUrl: './ub-zona-card.component.html',
  styleUrls: ['./ub-zona-card.component.css']
})
export class UbZonaCardComponent {
  @Input() zona!: ZonaCobertura;
}
