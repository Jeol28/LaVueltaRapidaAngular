import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {

  constructor(private router: Router) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    const user  = localStorage.getItem('user');
    const role  = localStorage.getItem('role');

    if (!token || !user || !role) return;

    if (role === 'admin') {
      this.router.navigate(['/admin/comidas']);
    } else if (role === 'operador') {
      this.router.navigate(['/operador/inicio']);
    } else {
      this.router.navigate(['/perfil']);
    }
  }
}
