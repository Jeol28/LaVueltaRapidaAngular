import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Categoria } from '../../../models/categoria.model';
import { Comida } from '../../../models/comida.model';
import { CategoriaService } from '../../../services/categoria.service';
import { ComidaService } from '../../../services/comida.service';

@Component({
  selector: 'app-tabla-productos',
  templateUrl: './tabla-productos.component.html',
  styleUrls: ['./tabla-productos.component.css']
})
export class TablaProductosComponent implements OnInit {

  categorias: Categoria[] = [];
  comidas: Comida[] = [];

  successMsg: string = '';
  showSuccess: boolean = false;
  hideSuccess: boolean = false;

  errorMsg: string = '';
  showError: boolean = false;
  hideError: boolean = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private comidaService: ComidaService,
    private categoriaService: CategoriaService
  ) {}

  ngOnInit(): void {
    this.loadCategorias();
    this.loadComidas();

    this.route.queryParams.subscribe(params => {
      const success = params['success'];
      const error   = params['error'];

      if (success === 'added')   { this.successMsg = '¡Producto agregado al menú exitosamente!';  this.triggerSuccess(); }
      if (success === 'updated') { this.successMsg = '¡Producto modificado exitosamente!';          this.triggerSuccess(); }
      if (success === 'deleted') { this.successMsg = '¡Producto eliminado correctamente!';          this.triggerSuccess(); }
      if (error != null)         { this.triggerError(); }
    });
  }

  private triggerSuccess(): void {
    this.showSuccess = true;
    this.hideSuccess = false;
    setTimeout(() => { this.hideSuccess = true; },  3500);
    setTimeout(() => { this.showSuccess = false; }, 4200);
  }

  private triggerError(): void {
    this.showError = true;
    this.hideError = false;
    setTimeout(() => { this.hideError = true; },  3500);
    setTimeout(() => { this.showError = false; }, 4200);
  }

  private loadCategorias(): void {
    this.categoriaService.getAll().subscribe(categorias => {
      this.categorias = categorias;
    });
  }

  getComidasByCategoria(categoria: Categoria): Comida[] {
    return this.comidas.filter(c => c.category.id === categoria.id);
  }

  irAProducto(id: number): void {
    this.router.navigate(['/producto', id]);
  }

  eliminarProducto(event: Event, id: number): void {
    event.stopPropagation();
    if (confirm('¿Seguro que quieres eliminar este producto?')) {
      this.comidaService.delete(id).subscribe({
        next: () => {
          this.loadComidas();
          this.successMsg = '¡Producto eliminado correctamente!';
          this.triggerSuccess();
        },
        error: err => {
          this.errorMsg = err?.error?.message
            ?? err?.error?.error
            ?? (typeof err?.error === 'string' ? err.error : null)
            ?? 'No se pudo eliminar el producto.';
          this.triggerError();
        }
      });
    }
  }

  private loadComidas(): void {
    this.comidaService.getAll().subscribe(comidas => {
      this.comidas = comidas;
    });
  }
}
