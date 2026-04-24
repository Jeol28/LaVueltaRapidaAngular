import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-tc-seccion',
  templateUrl: './tc-seccion.component.html',
  styleUrls: ['./tc-seccion.component.css']
})
export class TcSeccionComponent {
  @Input() numero: string = '';
  @Input() titulo: string = '';
  @Input() icono: string = '';
}
