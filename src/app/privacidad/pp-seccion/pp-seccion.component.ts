import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-pp-seccion',
  templateUrl: './pp-seccion.component.html',
  styleUrls: ['./pp-seccion.component.css']
})
export class PpSeccionComponent {
  @Input() numero: string = '';
  @Input() titulo: string = '';
  @Input() icono: string = '';
}
