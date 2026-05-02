import { Component, Input } from '@angular/core';
import { SedeContacto } from '../contacto/contacto.component';

@Component({
  selector: 'app-ct-sedes',
  templateUrl: './ct-sedes.component.html',
  styleUrls: ['./ct-sedes.component.css']
})
export class CtSedesComponent {
  @Input() sedes: SedeContacto[] = [];
}
