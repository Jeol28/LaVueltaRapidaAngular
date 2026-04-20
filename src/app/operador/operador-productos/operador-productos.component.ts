import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Comida } from '../../models/comida.model';
import { ComidaService } from '../../services/comida.service';

@Component({
  selector: 'app-operador-productos',
  templateUrl: './operador-productos.component.html',
  styleUrls: ['./operador-productos.component.css']
})
export class OperadorProductosComponent implements OnInit {

  comidas: Comida[] = [];
  cargando: boolean = true;
  errorMsg: string = '';

  constructor(
    private comidaService: ComidaService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const role = localStorage.getItem('role');
    if (role !== 'operador') {
      this.router.navigate(['/login']);
      return;
    }
    this.cargarComidas();
  }

  cargarComidas(): void {
    this.cargando = true;
    this.comidaService.getAll().subscribe({
      next: comidas => {
        this.comidas = comidas;
        this.cargando = false;
      },
      error: () => {
        this.errorMsg = 'No se pudieron cargar los productos.';
        this.cargando = false;
      }
    });
  }

  verDetalle(id: number): void {
    this.router.navigate(['/producto', id]);
  }

  formatCOP(amount: number): string {
    return new Intl.NumberFormat('es-CO').format(amount);
  }
}
