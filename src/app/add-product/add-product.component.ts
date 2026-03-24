import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Categoria } from '../models/categoria.model';
import { CATEGORIAS } from '../data/mock-data';
import { ComidaService } from '../services/comida.service';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent implements OnInit {

  editMode: boolean = false;
  editId: number | null = null;
  categorias: Categoria[] = CATEGORIAS;

  comida = {
    name: '',
    description: '',
    price: null as number | null,
    categoryId: null as number | null,
    image: '',
    available: true
  };

  previewUrl: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private comidaService: ComidaService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.editMode = true;
      this.editId = +id;
      const found = this.comidaService.getById(+id);
      if (found) {
        this.comida = {
          name: found.name,
          description: found.description,
          price: found.price,
          categoryId: found.category.id,
          image: found.image,
          available: found.available
        };
        this.previewUrl = found.image;
      }
    }
  }

  onImageInput(): void {
    this.previewUrl = this.comida.image;
  }

  get availableLabel(): string {
    return this.comida.available ? 'Disponible en el menú' : 'No disponible';
  }

  onSubmit(): void {
    if (this.editMode && this.editId !== null) {
      this.comidaService.update(this.editId, this.comida);
      this.router.navigate(['/producto/menutabla'], { queryParams: { success: 'updated' } });
    } else {
      this.comidaService.add(this.comida);
      this.router.navigate(['/producto/menutabla'], { queryParams: { success: 'added' } });
    }
  }
}
