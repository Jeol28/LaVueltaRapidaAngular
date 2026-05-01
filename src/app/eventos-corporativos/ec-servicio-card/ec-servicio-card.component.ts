import { Component, Input } from '@angular/core';
import { ServicioItem } from '../eventos-corporativos/eventos-corporativos.component';

@Component({
  selector: 'app-ec-servicio-card',
  templateUrl: './ec-servicio-card.component.html',
  styleUrls: ['./ec-servicio-card.component.css']
})
export class EcServicioCardComponent {
  @Input() servicio!: ServicioItem;
}
