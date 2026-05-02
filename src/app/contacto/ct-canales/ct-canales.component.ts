import { Component, Input } from '@angular/core';
import { CanalContacto } from '../contacto/contacto.component';

@Component({
  selector: 'app-ct-canales',
  templateUrl: './ct-canales.component.html',
  styleUrls: ['./ct-canales.component.css']
})
export class CtCanalesComponent {
  @Input() canales: CanalContacto[] = [];
}
