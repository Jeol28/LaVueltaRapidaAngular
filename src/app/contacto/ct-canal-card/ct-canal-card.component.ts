import { Component, Input } from '@angular/core';
import { CanalContacto } from '../contacto/contacto.component';

@Component({
  selector: 'app-ct-canal-card',
  templateUrl: './ct-canal-card.component.html',
  styleUrls: ['./ct-canal-card.component.css']
})
export class CtCanalCardComponent {
  @Input() canal!: CanalContacto;
}
