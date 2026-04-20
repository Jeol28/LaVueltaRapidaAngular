import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest } from 'rxjs';
import { Comida } from '../../models/comida.model';
import { Adicional } from '../../models/adicional.model';
import { ComidaService } from '../../services/comida.service';
import { CarritoService } from '../../services/carrito.service';

@Component({
  selector: 'app-producto-detalle',
  templateUrl: './producto-detalle.component.html',
  styleUrls: ['./producto-detalle.component.css']
})
export class ProductoDetalleComponent implements OnInit {

  comida: Comida | null = null;
  recomendaciones: Comida[] = [];
  selectedAdicionales: Set<number> = new Set();
  showToast: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private comidaService: ComidaService,
    private carritoService: CarritoService
  ) {}

  ngOnInit(): void {
    combineLatest([this.route.paramMap, this.route.queryParamMap]).subscribe(([params, queryParams]) => {
      const id = Number(params.get('id'));

      const preseleccionados = queryParams.get('adicionales');
      const idsPreseleccionados: Set<number> = preseleccionados
        ? new Set(preseleccionados.split(',').map(Number).filter(n => !isNaN(n) && n > 0))
        : new Set();

      this.comidaService.getById(id).subscribe({
        next: comida => {
          this.comida = comida;
          this.selectedAdicionales = new Set(idsPreseleccionados);

          this.comidaService.getAll().subscribe(comidas => {
            this.recomendaciones = this.comidaService.getRecomendaciones(comida, comidas);
          });
        },
        error: () => {
          this.router.navigate(['/menu']);
        }
      });
    });
  }

  toggleAdicional(id: number): void {
    if (this.selectedAdicionales.has(id)) {
      this.selectedAdicionales.delete(id);
    } else {
      this.selectedAdicionales.add(id);
    }
  }

  isSelected(id: number): boolean {
    return this.selectedAdicionales.has(id);
  }

  get total(): number {
    if (!this.comida) return 0;
    let sum = this.comida.price;
    this.comida.category.adicionales
      .filter(a => a.available && this.selectedAdicionales.has(a.id))
      .forEach(a => sum += a.price);
    return sum;
  }

  formatCOP(amount: number): string {
    return new Intl.NumberFormat('es-CO').format(amount);
  }

  addToCart(): void {
    if (!localStorage.getItem('user')) {
      this.router.navigate(['/login']);
      return;
    }
    if (!this.comida) return;

    const adicionales: Adicional[] = this.comida.category.adicionales
      .filter(a => a.available && this.selectedAdicionales.has(a.id));

    this.carritoService.agregar(this.comida, adicionales);

    this.showToast = true;
    setTimeout(() => { this.showToast = false; }, 2000);
  }
}
