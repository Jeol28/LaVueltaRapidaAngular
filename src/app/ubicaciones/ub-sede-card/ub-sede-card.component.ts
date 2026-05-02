import { Component, Input } from '@angular/core';
import { SedeUbicacion } from '../ubicaciones/ubicaciones.component';

@Component({
  selector: 'app-ub-sede-card',
  templateUrl: './ub-sede-card.component.html',
  styleUrls: ['./ub-sede-card.component.css']
})
export class UbSedeCardComponent {
  @Input() sede!: SedeUbicacion;

  get telefonoLink(): string {
    return 'tel:' + this.sede.telefono.replace(/\s+/g, '');
  }
}
