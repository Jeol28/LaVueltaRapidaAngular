import { Component, Input } from '@angular/core';
import { ExperienciaItem } from '../carreras-en-vivo/carreras-en-vivo.component';

@Component({
  selector: 'app-clv-seccion-plataformas',
  templateUrl: './clv-seccion-plataformas.component.html',
  styleUrls: ['./clv-seccion-plataformas.component.css']
})
export class ClvSeccionPlataformasComponent {
  @Input() titulo = '';
  @Input() plataformas: ExperienciaItem[] = [];
}
