import { Component, Input } from '@angular/core';
import { Comida } from '../models/comida.model';

@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.css']
})
export class CardsComponent {
  @Input()
  comida!:Comida
}
