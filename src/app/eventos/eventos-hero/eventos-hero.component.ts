import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-eventos-hero',
  templateUrl: './eventos-hero.component.html',
  styleUrls: ['./eventos-hero.component.css']
})
export class EventosHeroComponent {
  @Input() total = 0;
  @Input() completadas = 0;

  get restantes(): number { return this.total - this.completadas; }
}
