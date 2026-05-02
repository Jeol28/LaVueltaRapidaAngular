import { Component, Input } from '@angular/core';
import { VacanteItem } from '../trabaja-con-nosotros/trabaja-con-nosotros.component';

@Component({
  selector: 'app-tn-vacante-card',
  templateUrl: './tn-vacante-card.component.html',
  styleUrls: ['./tn-vacante-card.component.css']
})
export class TnVacanteCardComponent {
  @Input() vacante!: VacanteItem;
}
