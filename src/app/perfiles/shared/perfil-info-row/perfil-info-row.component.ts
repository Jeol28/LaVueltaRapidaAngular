import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-perfil-info-row',
  templateUrl: './perfil-info-row.component.html',
  styleUrls: ['./perfil-info-row.component.css']
})
export class PerfilInfoRowComponent {
  @Input() label: string = '';
  @Input() value: string = '';
}
