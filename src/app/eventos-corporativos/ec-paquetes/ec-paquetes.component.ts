import { Component, Input } from '@angular/core';
import { PaqueteCorporativo } from '../eventos-corporativos/eventos-corporativos.component';

@Component({
  selector: 'app-ec-paquetes',
  templateUrl: './ec-paquetes.component.html',
  styleUrls: ['./ec-paquetes.component.css']
})
export class EcPaquetesComponent {
  @Input() paquetes: PaqueteCorporativo[] = [];
}
