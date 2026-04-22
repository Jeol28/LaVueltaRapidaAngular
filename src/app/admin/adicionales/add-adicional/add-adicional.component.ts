import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
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

  adicional = {
    name: '',
    price: null as number | null,
    available: true,
    categoriaIds: [] as number[]
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private adicionalService: AdicionalService,
    private categoriaService: CategoriaService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.editMode = true;
      this.editId = +id;

      forkJoin({
        adicional: this.adicionalService.getById(+id),
        categorias: this.categoriaService.getAll()
      }).subscribe({
        next: ({ adicional, categorias }) => {
          this.categorias = categorias;
          const categoriaIds = categorias
            .filter(cat => (cat.adicionales ?? []).some(a => a.id === adicional.id))
            .map(cat => cat.id);
          this.adicional = {
            name: adicional.name,
            price: adicional.price,
            available: adicional.available,
            categoriaIds
          };
        },
        error: () => {
          this.router.navigate(['/admin/adicionales'], { queryParams: { error: 'notfound' } });
        }
      });
    } else {
      this.categoriaService.getAll().subscribe(categorias => {
        this.categorias = categorias;
      });
    }
  }

  toggleCategoria(catId: number, checked: boolean): void {
    if (checked) {
      if (!this.adicional.categoriaIds.includes(catId)) {
        this.adicional.categoriaIds = [...this.adicional.categoriaIds, catId];
      }
    } else {
      this.adicional.categoriaIds = this.adicional.categoriaIds.filter(id => id !== catId);
    }
  }

  isCategoriaSelected(catId: number): boolean {
    return this.adicional.categoriaIds.includes(catId);
  }

  onSubmit(): void {
    if (this.editMode && this.editId !== null) {
      this.adicionalService.update(this.editId, this.adicional).subscribe({
        next: () => this.router.navigate(['/admin/adicionales'], { queryParams: { success: 'updated' } }),
        error: () => this.router.navigate(['/admin/adicionales'], { queryParams: { error: 'update' } })
      });
    } else {
      this.adicionalService.add(this.adicional).subscribe({
        next: () => this.router.navigate(['/admin/adicionales'], { queryParams: { success: 'added' } }),
        error: () => this.router.navigate(['/admin/adicionales'], { queryParams: { error: 'add' } })
      });
    }
  }
}
