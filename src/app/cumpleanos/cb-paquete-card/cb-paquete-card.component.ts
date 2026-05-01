import { Component, Input } from '@angular/core';
import { PaqueteCumpleanos } from '../cumpleanos/cumpleanos.component';

@Component({
  selector: 'app-cb-paquete-card',
  templateUrl: './cb-paquete-card.component.html',
  styleUrls: ['./cb-paquete-card.component.css']
})
export class CbPaqueteCardComponent {
  @Input() paquete!: PaqueteCumpleanos;
}
