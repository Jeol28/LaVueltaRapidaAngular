import { Component, Input } from '@angular/core';
import { ExperienciaItem } from '../carreras-en-vivo/carreras-en-vivo.component';

@Component({
  selector: 'app-clv-plataforma-card',
  templateUrl: './clv-plataforma-card.component.html',
  styleUrls: ['./clv-plataforma-card.component.css']
})
export class ClvPlataformaCardComponent {
  @Input() plataforma!: ExperienciaItem;
}
