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
    return this.http.post<{ token: string; user: User }>(`${this.apiUrl}/login`, loginData).pipe(
      tap((response) => {
        this.saveToken(response.token);
        this.setCurrentUser(response.user);
      }),
      catchError(this.handleError)
    );
  }

  setCurrentUser(user: User | null): void {
    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user)); // 🛠 Speichert User in localStorage
    } else {
      localStorage.removeItem('currentUser'); // Löscht User, wenn ausgeloggt
    }
    this.currentUserSubject.next(user);
  }



  saveToken(token: string): void {
    localStorage.setItem('jwtToken', token);
  }

  loadUserFromToken(): void {
    const token = localStorage.getItem('jwtToken');

    if (token) {
      const headers = { Authorization: `Bearer ${token}` };

      this.http.get<User>(`${this.apiUrl}/me`, { headers }).subscribe({
        next: (user) => {
          this.setCurrentUser(user);
        },
        error: (err) => {
          console.error('Fehler beim Laden des Benutzers:', err);
          this.logout();
        },
      });
    }
  }

  logout(): void {
    localStorage.removeItem('jwtToken');
    this.setCurrentUser(null);
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    return throwError(() => new Error(error.message || 'Fehler beim Authentifizieren.'));
  }
}
