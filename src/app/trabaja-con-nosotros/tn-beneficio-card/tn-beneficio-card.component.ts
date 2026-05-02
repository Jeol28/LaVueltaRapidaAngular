import { Component, Input } from '@angular/core';
import { BeneficioItem } from '../trabaja-con-nosotros/trabaja-con-nosotros.component';

@Component({
  selector: 'app-tn-beneficio-card',
  templateUrl: './tn-beneficio-card.component.html',
  styleUrls: ['./tn-beneficio-card.component.css']
})
export class TnBeneficioCardComponent {
  @Input() beneficio!: BeneficioItem;
}
