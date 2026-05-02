import { Component, Input } from '@angular/core';
import { ValorItem } from '../nuestra-historia/nuestra-historia.component';

@Component({
  selector: 'app-nh-valor-card',
  templateUrl: './nh-valor-card.component.html',
  styleUrls: ['./nh-valor-card.component.css']
})
export class NhValorCardComponent {
  @Input() valor!: ValorItem;
}
