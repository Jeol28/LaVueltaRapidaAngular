import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { combineLatest } from 'rxjs';
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
  loading = true;

  constructor(
    private comidaService: ComidaService,
    private categoriaService: CategoriaService,
    private cdr: ChangeDetectorRef
  ) {
    history.scrollRestoration = 'manual';
  }

  ngOnInit(): void {
    combineLatest([
      this.categoriaService.getAll(),
      this.comidaService.getAll()
    ]).subscribe(([categorias, comidas]) => {
      this.categorias = categorias;
      this.comidas = comidas.filter(c => c.available);

      const saved = sessionStorage.getItem('menuScrollY');
      sessionStorage.removeItem('menuScrollY');

      requestAnimationFrame(() => {
        this.loading = false;
        this.cdr.detectChanges();
        if (saved) window.scrollTo({ top: +saved, behavior: 'instant' });
      });
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
