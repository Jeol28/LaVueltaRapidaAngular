import { Component, OnInit } from '@angular/core';
import { ComidaService } from '../services/comida.service';
import { CategoriaService } from '../services/categoria.service';
import { Categoria } from '../models/categoria.model';
import { Comida } from '../models/comida.model';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  categorias: Categoria[] = [];
  comidas: Comida[] = [];

  constructor(
    private comidaService: ComidaService,
    private categoriaService: CategoriaService
  ) {}

  ngOnInit(): void {
    this.categoriaService.getAll().subscribe(categorias => {
      this.categorias = categorias;
    });

    this.comidaService.getAll().subscribe(comidas => {
  console.log("COMIDAS:", comidas); // 👈 ADD THIS
  this.comidas = comidas.filter(c => c.available);
});
  }

  getComidaByCategoria(categoriaId: number): Comida[] {
    return this.comidas.filter(c => c.category.id === categoriaId);
  }

  getCategoryClass(categoriaName: string): string {
    const nombre = categoriaName.toLowerCase();
    if (nombre.includes('especial') || nombre.includes('bebida')) return 'yellow';
    return 'red';
  }
}
