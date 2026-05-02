import { Component, Input } from '@angular/core';
import { SedeContacto } from '../contacto/contacto.component';

@Component({
  selector: 'app-ct-sede-card',
  templateUrl: './ct-sede-card.component.html',
  styleUrls: ['./ct-sede-card.component.css']
})
export class CtSedeCardComponent {
  @Input() sede!: SedeContacto;

  get telefonoLink(): string {
    return 'tel:' + this.sede.telefono.replace(/\s+/g, '');
  }
}
