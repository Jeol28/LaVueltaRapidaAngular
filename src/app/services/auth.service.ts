import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private userSubject = new BehaviorSubject<string | null>(
    localStorage.getItem('user')
  );

  user$ = this.userSubject.asObservable();

  get currentUser(): string | null {
    return this.userSubject.value;
  }

  setUser(username: string, role: string): void {
    localStorage.setItem('user', username);
    localStorage.setItem('role', role);
    this.userSubject.next(username);
  }

  updateUsername(username: string): void {
    localStorage.setItem('user', username);
    this.userSubject.next(username);
  }

  logout(): void {
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    this.userSubject.next(null);
  }
}
