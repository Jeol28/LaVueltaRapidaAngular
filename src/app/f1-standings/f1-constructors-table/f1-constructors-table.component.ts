import { Component, Input } from '@angular/core';
import { F1Service, Constructor } from '../../services/f1.service';

@Component({
  selector: 'app-f1-constructors-table',
  templateUrl: './f1-constructors-table.component.html',
  styleUrls: ['./f1-constructors-table.component.css']
})
export class F1ConstructorsTableComponent {
  @Input() constructores: Constructor[] = [];

  constructor(public f1: F1Service) {}
}
