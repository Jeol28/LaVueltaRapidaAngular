import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-clv-proxima-carrera',
  templateUrl: './clv-proxima-carrera.component.html',
  styleUrls: ['./clv-proxima-carrera.component.css']
})
export class ClvProximaCarreraComponent {
  @Input() carrera: any;

  get roundLabel(): string {
    const r = this.carrera?.round ?? 0;
    return r < 10 ? `0${r}` : `${r}`;
  }
}
