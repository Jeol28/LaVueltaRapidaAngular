import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-admin-hero',
  templateUrl: './admin-hero.component.html',
  styleUrls: ['./admin-hero.component.css']
})
export class AdminHeroComponent {
  @Input() titlePrefix: string = '';
  @Input() titleHighlight: string = '';
  @Input() subtitle: string = '';
  @Input() btnLabel: string = '';
  @Input() btnRoute: string = '';
}
