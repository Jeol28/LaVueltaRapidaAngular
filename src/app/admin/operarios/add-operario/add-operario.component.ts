import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OperadorService } from '../../../services/operador.service';

@Component({
  selector: 'app-add-operario',
  templateUrl: './add-operario.component.html',
  styleUrls: ['./add-operario.component.css']
})
export class AddOperarioComponent implements OnInit {

  editMode: boolean = false;
  editId: number | null = null;
  showPassword: boolean = false;

  operario = {
    nombre: '',
    usuario: '',
    contrasena: ''
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private operadorService: OperadorService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.editMode = true;
      this.editId = +id;
      this.operadorService.getById(+id).subscribe({
        next: found => {
          this.operario = {
            nombre: found.nombre,
            usuario: found.usuario,
            contrasena: ''
          };
        },
        error: () => {
          this.router.navigate(['/admin/operarios'], { queryParams: { error: 'notfound' } });
        }
      });
    }
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    if (this.editMode && this.editId !== null) {
      const payload: { nombre: string; usuario: string; contrasena?: string } = {
        nombre: this.operario.nombre,
        usuario: this.operario.usuario
      };
      if (this.operario.contrasena) {
        payload.contrasena = this.operario.contrasena;
      }
      this.operadorService.update(this.editId, payload).subscribe(() => {
        this.router.navigate(['/admin/operarios'], { queryParams: { success: 'updated' } });
      });
    } else {
      this.operadorService.add(this.operario).subscribe(() => {
        this.router.navigate(['/admin/operarios'], { queryParams: { success: 'added' } });
      });
    }
  }
}
