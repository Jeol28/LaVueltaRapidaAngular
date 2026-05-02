import { Component, Input } from '@angular/core';
import { VacanteItem } from '../trabaja-con-nosotros/trabaja-con-nosotros.component';

@Component({
  selector: 'app-tn-vacantes',
  templateUrl: './tn-vacantes.component.html',
  styleUrls: ['./tn-vacantes.component.css']
})
export class TnVacantesComponent {
  @Input() vacantes: VacanteItem[] = [];
}
