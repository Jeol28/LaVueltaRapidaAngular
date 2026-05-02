import { Component, Input } from '@angular/core';
import { BeneficioFranquiciaItem } from '../franquicias/franquicias.component';

@Component({
  selector: 'app-fr-beneficio-card',
  templateUrl: './fr-beneficio-card.component.html',
  styleUrls: ['./fr-beneficio-card.component.css']
})
export class FrBeneficioCardComponent {
  @Input() beneficio!: BeneficioFranquiciaItem;
}
