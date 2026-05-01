import { Component, Input } from '@angular/core';
import { IncluyeItem } from '../cumpleanos/cumpleanos.component';

@Component({
  selector: 'app-cb-incluye',
  templateUrl: './cb-incluye.component.html',
  styleUrls: ['./cb-incluye.component.css']
})
export class CbIncluyeComponent {
  @Input() items: IncluyeItem[] = [];
}
