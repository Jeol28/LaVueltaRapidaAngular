import { Component, Input } from '@angular/core';
import { BeneficioFranquiciaItem } from '../franquicias/franquicias.component';

@Component({
  selector: 'app-fr-beneficios',
  templateUrl: './fr-beneficios.component.html',
  styleUrls: ['./fr-beneficios.component.css']
})
export class FrBeneficiosComponent {
  @Input() beneficios: BeneficioFranquiciaItem[] = [];
}
