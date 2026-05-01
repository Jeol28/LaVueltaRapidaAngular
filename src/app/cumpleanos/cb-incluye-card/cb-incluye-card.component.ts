import { Component, Input } from '@angular/core';
import { IncluyeItem } from '../cumpleanos/cumpleanos.component';

@Component({
  selector: 'app-cb-incluye-card',
  templateUrl: './cb-incluye-card.component.html',
  styleUrls: ['./cb-incluye-card.component.css']
})
export class CbIncluyeCardComponent {
  @Input() item!: IncluyeItem;
}
