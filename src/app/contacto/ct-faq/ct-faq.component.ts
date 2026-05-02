import { Component, Input } from '@angular/core';
import { FaqItem } from '../contacto/contacto.component';

@Component({
  selector: 'app-ct-faq',
  templateUrl: './ct-faq.component.html',
  styleUrls: ['./ct-faq.component.css']
})
export class CtFaqComponent {
  @Input() faqs: FaqItem[] = [];
}
