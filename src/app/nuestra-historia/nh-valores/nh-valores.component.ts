import { Component, Input } from '@angular/core';
import { ValorItem } from '../nuestra-historia/nuestra-historia.component';

@Component({
  selector: 'app-nh-valores',
  templateUrl: './nh-valores.component.html',
  styleUrls: ['./nh-valores.component.css']
})
export class NhValoresComponent {
  @Input() valores: ValorItem[] = [];
}
