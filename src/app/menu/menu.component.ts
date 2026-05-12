import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, Subscription } from 'rxjs';
import { ComidaService } from '../services/comida.service';
import { CategoriaService } from '../services/categoria.service';
import { Categoria } from '../models/categoria.model';
import { Comida } from '../models/comida.model';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit, OnDestroy {

  categorias: Categoria[] = [];
  comidas: Comida[] = [];
  loading = true;

  private loaded = false;
  private fragmentSub = Subscription.EMPTY;

  constructor(
    private comidaService: ComidaService,
    private categoriaService: CategoriaService,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute
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
      const fragment = this.route.snapshot.fragment;

      requestAnimationFrame(() => {
        this.loading = false;
        this.cdr.detectChanges();

        if (fragment) {
          this.scrollToFragment(fragment);
        } else if (saved) {
          window.scrollTo({ top: +saved, behavior: 'instant' });
        } else {
          window.scrollTo({ top: 0, behavior: 'instant' });
        }

        this.loaded = true;
      });
    });

    this.fragmentSub = this.route.fragment.subscribe(fragment => {
      if (!this.loaded || !fragment) return;
      requestAnimationFrame(() => this.scrollToFragment(fragment));
    });
  }

  ngOnDestroy(): void {
    this.fragmentSub.unsubscribe();
  }

  private scrollToFragment(fragment: string): void {
    const el = document.getElementById(fragment);
    if (el) {
      const headerHeight = document.getElementById('siteHeader')?.offsetHeight ?? 68;
      window.scrollTo({ top: el.offsetTop - headerHeight - 24, behavior: 'instant' });
    }
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
