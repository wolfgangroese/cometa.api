import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, ReplaySubject } from 'rxjs';
import { environment } from '../../environments/environment.dev';
import { catchError, tap } from 'rxjs/operators';
import { RegisterDto } from '../models/dtos/register.dto';
import { LoginDto } from '../models/dtos/login.dto';
import { User } from '../models/user.model';

interface TokenPayload {
  nameid: string;
  unique_name: string;
  email: string;
  role: string[] | string;
  exp: number;
  iss: string;
  aud: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = `${environment.api.baseUrl}/auth`;
  private currentUserSubject = new ReplaySubject<User | null>(1);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {}

  register(registerData: RegisterDto): Observable<unknown> {
    return this.http.post<unknown>(`${this.apiUrl}/register`, registerData).pipe(
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

    // Store the parsed token claims to access roles
    if (token) {
      const tokenData = this.parseJwt(token);
      localStorage.setItem('tokenData', JSON.stringify(tokenData));
    } else {
      localStorage.removeItem('tokenData');
    }
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
    localStorage.removeItem('tokenData');
    this.setCurrentUser(null);
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('Auth service error:', error);
    return throwError(() => new Error(error.message || 'Fehler beim Authentifizieren.'));
  }

  /**
   * Gibt den aktuellen Benutzer synchron zurück
   * @returns Der aktuelle Benutzer oder null, wenn nicht eingeloggt
   */
  getCurrentUserSync(): User | null {
    const userJson = localStorage.getItem('currentUser');
    if (!userJson) {
      return null;
    }

    try {
      return JSON.parse(userJson) as User;
    } catch (e) {
      console.error('Fehler beim Parsen des User-Objekts aus localStorage:', e);
      return null;
    }
  }

  /**
   * Parse JWT token to get claims including roles
   */
  private parseJwt(token: string): TokenPayload {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));

      return JSON.parse(jsonPayload) as TokenPayload;
    } catch (e) {
      console.error('Error parsing JWT token:', e);
      return {} as TokenPayload;
    }
  }

  /**
   * Check if the current user has the specified role
   */
  hasRole(role: string): boolean {
    const tokenDataStr = localStorage.getItem('tokenData');
    if (!tokenDataStr) {
      return false;
    }

    try {
      const tokenData = JSON.parse(tokenDataStr) as TokenPayload;
      // Check 'role' claim in token (format varies depending on your JWT configuration)
      const roles = tokenData.role || [];

      // Handle both array and string formats
      if (Array.isArray(roles)) {
        return roles.includes(role);
      } else if (typeof roles === 'string') {
        return roles === role;
      }

      return false;
    } catch (e) {
      console.error('Error checking user role:', e);
      return false;
    }
  }

  /**
   * Check if user has any of the specified roles
   */
  hasAnyRole(roles: string[]): boolean {
    return roles.some(role => this.hasRole(role));
  }
  /**
   * Direct authentication test that bypasses the interceptor
   */
  testDirectAuth(): Observable<any> {
    const token = localStorage.getItem('jwtToken');
    console.log('Testing direct auth with token:', token ? 'Token exists' : 'No token');

    if (!token) {
      return throwError(() => new Error('No token available'));
    }

    // Create headers manually to bypass interceptor
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    console.log('Authorization header created manually');

    // Make a direct request to the auth test endpoint
    return this.http.get<any>(`${environment.api.baseUrl}/tasks/auth-test`, { headers })
      .pipe(
        tap(response => console.log('Direct auth test successful:', response)),
        catchError(error => {
          console.error('Direct auth test failed:', error);
          return throwError(() => error);
        })
      );
  }

}
