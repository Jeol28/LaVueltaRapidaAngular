import { Component, Input } from '@angular/core';
import { ServicioItem } from '../eventos-corporativos/eventos-corporativos.component';

@Component({
  selector: 'app-ec-servicios',
  templateUrl: './ec-servicios.component.html',
  styleUrls: ['./ec-servicios.component.css']
})
export class EcServiciosComponent {
  @Input() servicios: ServicioItem[] = [];
}
