
import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap, catchError, throwError } from 'rxjs';

export interface User {
  id: number;
  studentId: number;
  name: string;
  email: string;
}

export interface LoginPayload {
  email: string;
  password: string;
  remember: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);

  private readonly _currentUser = signal<User | null>(null);

  readonly currentUser = this._currentUser.asReadonly();

  readonly isLoggedIn = computed(
    () => this._currentUser() !== null
  );

  login(credentials: LoginPayload) {
    return this.http.post<User>(
      '/mock-api/login',
      credentials,
      { withCredentials: true }
    ).pipe(
      tap(user => {
        this._currentUser.set(user);
      })
    );
  }

  checkSession() {
    return this.http.get<User>(
      '/mock-api/me',
      { withCredentials: true }
    ).pipe(
      tap(user => {
        this._currentUser.set(user);
      }),
      catchError(error => {
        this._currentUser.set(null);
        return throwError(() => error);
      })
    );
  }

  logout() {
    return this.http.post(
      '/mock-api/logout',
      {},
      { withCredentials: true }
    ).pipe(
      tap(() => {
        this._currentUser.set(null);
      })
    );
  }
}
