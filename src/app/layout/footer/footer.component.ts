import { Component } from '@angular/core';
import { CATEGORIAS } from '../../data/mock-data';
import { Categoria } from '../../models/categoria.model';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {
  categorias: Categoria[] = CATEGORIAS;
}
