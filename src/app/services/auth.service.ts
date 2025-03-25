import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, ReplaySubject } from 'rxjs';
import { environment } from '../../environments/environment.dev';
import { catchError, tap } from 'rxjs/operators';
import { RegisterDto } from '../models/dtos/register.dto';
import { LoginDto } from '../models/dtos/login.dto';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = `${environment.api.baseUrl}/auth`;
  private currentUserSubject = new ReplaySubject<User | null>(1);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {}

  register(registerData: RegisterDto): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, registerData).pipe(
      catchError(this.handleError)
    );
  }

  login(loginData: LoginDto): Observable<{ token: string; user: User }> {
    console.log('Login attempt with:', loginData.email);
    return this.http.post<{ token: string; user: User }>(`${this.apiUrl}/login`, loginData).pipe(
      tap((response) => {
        console.log('Login success, token received:', response.token ? 'Yes' : 'No');
        this.saveToken(response.token);
        this.setCurrentUser(response.user);
      }),
      catchError((error) => {
        console.error('Login error:', error);
        return throwError(() => error);
      })
    );
  }

  setCurrentUser(user: User | null): void {
    if (user) {
      console.log('Setting current user:', user.userName);
      localStorage.setItem('currentUser', JSON.stringify(user));
    } else {
      console.log('Removing current user from storage');
      localStorage.removeItem('currentUser');
    }
    this.currentUserSubject.next(user);
  }

  saveToken(token: string): void {
    console.log('Saving token to localStorage:', token ? 'Yes (token exists)' : 'No (empty token)');
    localStorage.setItem('jwtToken', token);
  }

  loadUserFromToken(): void {
    const token = localStorage.getItem('jwtToken');
    console.log('Attempting to load user from token:', token ? 'Token exists' : 'No token found');

    if (token) {
      const headers = { Authorization: `Bearer ${token}` };
      console.log('Using authorization header:', headers.Authorization);

      this.http.get<User>(`${this.apiUrl}/me`, { headers }).subscribe({
        next: (user) => {
          console.log('User loaded successfully:', user.userName);
          this.setCurrentUser(user);
        },
        error: (err) => {
          console.error('Error loading user from token:', err);
          this.logout();
        },
      });
    }
  }

  logout(): void {
    console.log('Logging out, removing token and user');
    localStorage.removeItem('jwtToken');
    this.setCurrentUser(null);
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('Auth service error:', error);
    return throwError(() => new Error(error.message || 'Fehler beim Authentifizieren.'));
  }
}
