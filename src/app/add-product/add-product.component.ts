import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Categoria } from '../models/categoria.model';
import { CATEGORIAS, COMIDAS } from '../data/mock-data';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent implements OnInit {

  editMode: boolean = false;
  categorias: Categoria[] = CATEGORIAS;

  comida = {
    id: null as number | null,
    name: '',
    description: '',
    price: null as number | null,
    categoryId: null as number | null,
    image: '',
    available: true
  };

  previewUrl: string = '';

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.editMode = true;
      const found = COMIDAS.find(c => c.id === +id);
      if (found) {
        this.comida = {
          id: found.id,
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
    const successType = this.editMode ? 'updated' : 'added';
    this.router.navigate(['/producto/menutabla'], { queryParams: { success: successType } });
  }
}
