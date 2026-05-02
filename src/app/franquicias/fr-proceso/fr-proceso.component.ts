import { Component, Input } from '@angular/core';
import { PasoFranquicia } from '../franquicias/franquicias.component';

@Component({
  selector: 'app-fr-proceso',
  templateUrl: './fr-proceso.component.html',
  styleUrls: ['./fr-proceso.component.css']
})
export class FrProcesoComponent {
  @Input() pasos: PasoFranquicia[] = [];
}
