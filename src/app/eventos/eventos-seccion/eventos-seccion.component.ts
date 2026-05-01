import { Component, Input } from '@angular/core';
import { EventoF1 } from '../eventos/eventos.component';

@Component({
  selector: 'app-eventos-seccion',
  templateUrl: './eventos-seccion.component.html',
  styleUrls: ['./eventos-seccion.component.css']
})
export class EventosSeccionComponent {
  @Input() titulo = '';
  @Input() eventos: EventoF1[] = [];
  @Input() nextRound = 0;
}
