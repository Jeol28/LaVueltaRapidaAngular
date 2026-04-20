import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-operador-hero',
  templateUrl: './operador-hero.component.html',
  styleUrls: ['./operador-hero.component.css']
})
export class OperadorHeroComponent {
  @Input() titlePrefix: string = '';
  @Input() titleHighlight: string = '';
  @Input() subtitle: string = '';
}
