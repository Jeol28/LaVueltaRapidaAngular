import { Component, Input } from '@angular/core';
import { CifraItem } from '../nuestra-historia/nuestra-historia.component';

@Component({
  selector: 'app-nh-cifras',
  templateUrl: './nh-cifras.component.html',
  styleUrls: ['./nh-cifras.component.css']
})
export class NhCifrasComponent {
  @Input() cifras: CifraItem[] = [];
}
