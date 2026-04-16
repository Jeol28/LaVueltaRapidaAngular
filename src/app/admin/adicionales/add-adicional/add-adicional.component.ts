import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdicionalService } from '../../../services/adicional.service';
import { CategoriaService } from '../../../services/categoria.service';
import { Categoria } from '../../../models/categoria.model';

@Component({
  selector: 'app-add-adicional',
  templateUrl: './add-adicional.component.html',
  styleUrls: ['./add-adicional.component.css']
})
export class AddAdicionalComponent implements OnInit {

  editMode: boolean = false;
  editId: number | null = null;
  categorias: Categoria[] = [];
  selectedCategorias: Set<number> = new Set();

  adicional = {
    name: '',
    price: null as number | null,
    available: true
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private adicionalService: AdicionalService,
    private categoriaService: CategoriaService
  ) {}

  ngOnInit(): void {
    // Cargar categorías
    this.categoriaService.getAll().subscribe(categorias => {
      this.categorias = categorias;
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.editMode = true;
      this.editId = +id;
      this.adicionalService.getById(+id).subscribe({
        next: found => {
          this.adicional = {
            name: found.name,
            price: found.price,
            available: found.available
          };

          // Cargar categorías del adicional
          this.adicionalService.getCategoriesOfAdicional(+id).subscribe(categorias => {
            categorias.forEach(cat => {
              this.selectedCategorias.add(cat.id);
            });
          });
        },
        error: () => {
          this.router.navigate(['/admin/adicionales'], { queryParams: { error: 'notfound' } });
        }
      });
    }
  }

  toggleCategoria(categoriaId: number): void {
    if (this.selectedCategorias.has(categoriaId)) {
      this.selectedCategorias.delete(categoriaId);
    } else {
      this.selectedCategorias.add(categoriaId);
    }
  }

  isSelected(categoriaId: number): boolean {
    return this.selectedCategorias.has(categoriaId);
  }

  onSubmit(): void {
    const categoriaIds = Array.from(this.selectedCategorias);
    
    if (this.editMode && this.editId !== null) {
      this.adicionalService.update(this.editId, {
        name: this.adicional.name,
        price: this.adicional.price,
        available: this.adicional.available,
        categoriaIds: categoriaIds
      }).subscribe({
        next: () => this.router.navigate(['/admin/adicionales'], { queryParams: { success: 'updated' } }),
        error: () => this.router.navigate(['/admin/adicionales'], { queryParams: { error: 'update' } })
      });
    } else {
      this.adicionalService.add({
        name: this.adicional.name,
        price: this.adicional.price,
        available: this.adicional.available,
        categoriaIds: categoriaIds
      }).subscribe({
        next: () => this.router.navigate(['/admin/adicionales'], { queryParams: { success: 'added' } }),
        error: () => this.router.navigate(['/admin/adicionales'], { queryParams: { error: 'add' } })
      });
    }
  }
}
