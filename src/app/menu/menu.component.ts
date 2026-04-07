import { Component, OnInit } from '@angular/core';
import { ComidaService } from '../services/comida.service';
import { CATEGORIAS } from '../data/mock-data';
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

  constructor(private comidaService: ComidaService) {}

  ngOnInit(): void {
    this.categorias = CATEGORIAS;
    this.comidas = this.comidaService.getAll().filter(c => c.available);
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
