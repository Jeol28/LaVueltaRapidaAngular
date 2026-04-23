import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DomiciliarioService } from '../../../services/domiciliario.service';

@Component({
  selector: 'app-add-domiciliario',
  templateUrl: './add-domiciliario.component.html',
  styleUrls: ['./add-domiciliario.component.css']
})
export class AddDomiciliarioComponent implements OnInit {

  editMode: boolean = false;
  editId: number | null = null;

  domiciliario = {
    nombre: '',
    cedula: '',
    celular: '',
    disponible: true
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private domiciliarioService: DomiciliarioService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.editMode = true;
      this.editId = +id;
      this.domiciliarioService.getById(+id).subscribe({
        next: found => {
          this.domiciliario = {
            nombre: found.nombre,
            cedula: found.cedula,
            celular: found.celular,
            disponible: found.disponible
          };
        },
        error: () => {
          this.router.navigate(['/admin/domiciliarios'], { queryParams: { error: 'notfound' } });
        }
      });
    }
  }

  onSubmit(): void {
    if (this.editMode && this.editId !== null) {
      this.domiciliarioService.update(this.editId, this.domiciliario).subscribe({
        next: () => this.router.navigate(['/admin/domiciliarios'], { queryParams: { success: 'updated' } }),
        error: () => this.router.navigate(['/admin/domiciliarios'], { queryParams: { error: 'update' } })
      });
    } else {
      this.domiciliarioService.add(this.domiciliario).subscribe({
        next: () => this.router.navigate(['/admin/domiciliarios'], { queryParams: { success: 'added' } }),
        error: () => this.router.navigate(['/admin/domiciliarios'], { queryParams: { error: 'add' } })
      });
    }
  }
}
