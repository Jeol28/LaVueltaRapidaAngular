import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-auth-form-card',
  templateUrl: './auth-form-card.component.html',
  styleUrls: ['./auth-form-card.component.css']
})
export class AuthFormCardComponent {
  @Input() heroTitle: string = '';
  @Input() heroHighlight: string = '';
  @Input() heroSubtitle: string = '';
  @Input() cardTitle: string = '';
  @Input() cardSubtitle: string = '';
}
