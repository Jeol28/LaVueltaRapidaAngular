import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Categoria } from '../models/categoria.model';
import { Comida } from '../models/comida.model';
import { CATEGORIAS, COMIDAS } from '../data/mock-data';

@Component({
  selector: 'app-tabla-menu',
  templateUrl: './tabla-menu.component.html',
  styleUrls: ['./tabla-menu.component.css']
})
export class TablaMenuComponent {

  categorias: Categoria[] = CATEGORIAS;
  comidas: Comida[] = COMIDAS;

  constructor(private router: Router) {}

  getComidasByCategoria(categoria: Categoria): Comida[] {
    return this.comidas.filter(c => c.category.id === categoria.id);
  }

  irAProducto(id: number): void {
    this.router.navigate(['/producto', id]);
  }

  eliminarProducto(event: Event, id: number): void {
    event.stopPropagation();
    if (confirm('¿Seguro que quieres eliminar este producto?')) {
      this.router.navigate(['/producto/delete', id]);
    }
  }
}
