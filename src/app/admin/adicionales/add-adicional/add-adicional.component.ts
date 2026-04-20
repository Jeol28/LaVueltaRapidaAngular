import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdicionalService } from '../../../services/adicional.service';

@Component({
  selector: 'app-add-adicional',
  templateUrl: './add-adicional.component.html',
  styleUrls: ['./add-adicional.component.css']
})
export class AddAdicionalComponent implements OnInit {

  editMode: boolean = false;
  editId: number | null = null;

  adicional = {
    name: '',
    price: null as number | null,
    available: true
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private adicionalService: AdicionalService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.editMode = true;
      this.editId = +id;
      this.adicionalService.getById(+id).subscribe({
        next: found => {
          this.adicional = {
            name: found.name,
            price: found.price,
            available: found.available
          };
        },
        error: () => {
          this.router.navigate(['/admin/adicionales'], { queryParams: { error: 'notfound' } });
        }
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
