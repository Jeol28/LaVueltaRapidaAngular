import { Component, Input } from '@angular/core';
import { ModeloFranquiciaItem } from '../franquicias/franquicias.component';

@Component({
  selector: 'app-fr-modelos',
  templateUrl: './fr-modelos.component.html',
  styleUrls: ['./fr-modelos.component.css']
})
export class FrModelosComponent {
  @Input() modelos: ModeloFranquiciaItem[] = [];
}
