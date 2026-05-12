import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'LaVueltaRapida';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    const username = localStorage.getItem('user');
    const role = localStorage.getItem('role');

    if (username && role) {
      this.authService.verify(username, role).subscribe(exists => {
        if (!exists) {
          localStorage.clear();
          this.router.navigate(['/login']);
        }
      });
    }
  }
}
