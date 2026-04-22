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
    categoryId: null as number | null
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
          const categoriaActual = categorias.find(cat =>
            (cat.adicionales ?? []).some(a => a.id === adicional.id)
          );
          this.adicional = {
            name: adicional.name,
            price: adicional.price,
            available: adicional.available,
            categoryId: categoriaActual ? categoriaActual.id : null
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
