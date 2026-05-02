import { Component, Input } from '@angular/core';
import { PasoProceso } from '../trabaja-con-nosotros/trabaja-con-nosotros.component';

@Component({
  selector: 'app-tn-proceso',
  templateUrl: './tn-proceso.component.html',
  styleUrls: ['./tn-proceso.component.css']
})
export class TnProcesoComponent {
  @Input() pasos: PasoProceso[] = [];
}
