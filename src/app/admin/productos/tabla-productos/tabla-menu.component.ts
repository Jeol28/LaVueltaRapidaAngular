import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Categoria } from '../../../models/categoria.model';
import { Comida } from '../../../models/comida.model';
import { CATEGORIAS } from '../../../data/mock-data';
import { ComidaService } from '../../../services/comida.service';

@Component({
  selector: 'app-tabla-menu',
  templateUrl: './tabla-menu.component.html',
  styleUrls: ['./tabla-menu.component.css']
})
export class TablaMenuComponent implements OnInit {

  categorias: Categoria[] = CATEGORIAS;
  comidas: Comida[] = [];

  successMsg: string = '';
  showSuccess: boolean = false;
  hideSuccess: boolean = false;

  showError: boolean = false;
  hideError: boolean = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private comidaService: ComidaService
  ) {}

  ngOnInit(): void {
    this.comidas = this.comidaService.getAll();

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

  getComidasByCategoria(categoria: Categoria): Comida[] {
    return this.comidas.filter(c => c.category.id === categoria.id);
  }

  irAProducto(id: number): void {
    this.router.navigate(['/producto', id]);
  }

  eliminarProducto(event: Event, id: number): void {
    event.stopPropagation();
    if (confirm('¿Seguro que quieres eliminar este producto?')) {
      this.comidaService.delete(id);
      this.comidas = this.comidaService.getAll();
      this.successMsg = '¡Producto eliminado correctamente!';
      this.triggerSuccess();
    }
  }
}
