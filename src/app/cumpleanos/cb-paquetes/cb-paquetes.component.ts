import { Component, Input } from '@angular/core';
import { PaqueteCumpleanos } from '../cumpleanos/cumpleanos.component';

@Component({
  selector: 'app-cb-paquetes',
  templateUrl: './cb-paquetes.component.html',
  styleUrls: ['./cb-paquetes.component.css']
})
export class CbPaquetesComponent {
  @Input() paquetes: PaqueteCumpleanos[] = [];
}
