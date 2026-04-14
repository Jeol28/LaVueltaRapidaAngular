import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  private apiUrl = 'http://localhost:8080/api/menu';

  constructor(private http: HttpClient) {}

  getMenu() {
    return this.http.get<any[]>(this.apiUrl);
  }
}