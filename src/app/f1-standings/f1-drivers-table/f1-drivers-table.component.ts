import { Component, Input } from '@angular/core';
import { F1Service, Piloto } from '../../services/f1.service';

@Component({
  selector: 'app-f1-drivers-table',
  templateUrl: './f1-drivers-table.component.html',
  styleUrls: ['./f1-drivers-table.component.css']
})
export class F1DriversTableComponent {
  @Input() pilotos: Piloto[] = [];
  @Input() loading: boolean = false;
  @Input() error: string | null = null;

  constructor(public f1: F1Service) {}
}
