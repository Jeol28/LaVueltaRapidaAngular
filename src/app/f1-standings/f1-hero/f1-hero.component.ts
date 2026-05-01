import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-f1-hero',
  templateUrl: './f1-hero.component.html',
  styleUrls: ['./f1-hero.component.css']
})
export class F1HeroComponent {
  @Input() nextRace: any;
}
