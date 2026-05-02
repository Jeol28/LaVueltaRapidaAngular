import { Component, Input } from '@angular/core';
import { BeneficioItem } from '../trabaja-con-nosotros/trabaja-con-nosotros.component';

@Component({
  selector: 'app-tn-beneficios',
  templateUrl: './tn-beneficios.component.html',
  styleUrls: ['./tn-beneficios.component.css']
})
export class TnBeneficiosComponent {
  @Input() beneficios: BeneficioItem[] = [];
}
