import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OperadorService } from '../../services/operador.service';

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
      const found = this.operadorService.getById(+id);
      if (found) {
        this.operario = {
          nombre: found.nombre,
          usuario: found.usuario,
          contrasena: found.contrasena
        };
      }
    }
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    if (this.editMode && this.editId !== null) {
      this.operadorService.update(this.editId, this.operario);
      this.router.navigate(['/admin/operarios'], { queryParams: { success: 'updated' } });
    } else {
      this.operadorService.add(this.operario);
      this.router.navigate(['/admin/operarios'], { queryParams: { success: 'added' } });
    }
  }
}
