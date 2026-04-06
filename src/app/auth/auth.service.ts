import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface AuthUser {
  username: string;
  isAdmin: boolean;
}

@Injectable({ providedIn: 'root' })
export class AuthService {

  private readonly MOCK_USERS = [
    { username: 'admin', password: 'admin', isAdmin: true }
  ];

  private _user = new BehaviorSubject<AuthUser | null>(null);
  user$ = this._user.asObservable();

  get currentUser(): AuthUser | null {
    return this._user.getValue();
  }

  login(username: string, password: string): boolean {
    const match = this.MOCK_USERS.find(
      u => u.username === username && u.password === password
    );
    if (match) {
      this._user.next({ username: match.username, isAdmin: match.isAdmin });
      return true;
    }
    return false;
  }

  logout(): void {
    this._user.next(null);
  }
}
