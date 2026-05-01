import { Component, Input } from '@angular/core';
import { PaqueteCorporativo } from '../eventos-corporativos/eventos-corporativos.component';

@Component({
  selector: 'app-ec-paquete-card',
  templateUrl: './ec-paquete-card.component.html',
  styleUrls: ['./ec-paquete-card.component.css']
})
export class EcPaqueteCardComponent {
  @Input() paquete!: PaqueteCorporativo;
}
