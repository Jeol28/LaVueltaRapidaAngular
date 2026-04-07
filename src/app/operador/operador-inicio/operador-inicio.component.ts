import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-operador-inicio',
  templateUrl: './operador-inicio.component.html',
  styleUrls: ['./operador-inicio.component.css']
})
export class OperadorInicioComponent implements OnInit {

  constructor(private router: Router) {}

  ngOnInit(): void {
    const role = localStorage.getItem('role');
    if (role !== 'operador') {
      this.router.navigate(['/login']);
    }
  }
}
