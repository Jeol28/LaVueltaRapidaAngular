import { Component, Input } from '@angular/core';
import { EventoF1 } from '../eventos/eventos.component';

@Component({
  selector: 'app-evento-card',
  templateUrl: './evento-card.component.html',
  styleUrls: ['./evento-card.component.css']
})
export class EventoCardComponent {
  @Input() evento!: EventoF1;
  @Input() isNext = false;

  get roundLabel(): string {
    return this.evento.round < 10 ? `0${this.evento.round}` : `${this.evento.round}`;
  }
}
