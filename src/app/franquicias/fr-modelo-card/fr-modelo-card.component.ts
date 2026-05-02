import { Component, Input } from '@angular/core';
import { ModeloFranquiciaItem } from '../franquicias/franquicias.component';

@Component({
  selector: 'app-fr-modelo-card',
  templateUrl: './fr-modelo-card.component.html',
  styleUrls: ['./fr-modelo-card.component.css']
})
export class FrModeloCardComponent {
  @Input() modelo!: ModeloFranquiciaItem;
}
