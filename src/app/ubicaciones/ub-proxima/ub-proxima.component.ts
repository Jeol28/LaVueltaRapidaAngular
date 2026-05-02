import { Component, Input } from '@angular/core';
import { ProximaApertura } from '../ubicaciones/ubicaciones.component';

@Component({
  selector: 'app-ub-proxima',
  templateUrl: './ub-proxima.component.html',
  styleUrls: ['./ub-proxima.component.css']
})
export class UbProximaComponent {
  @Input() aperturas: ProximaApertura[] = [];
}
