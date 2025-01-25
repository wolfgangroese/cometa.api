import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment.dev'; // Umgebungsvariablen für die API-URL
import { catchError } from 'rxjs/operators';
import { RegisterDto } from '../models/dtos/register.dto'; // Importiere die Modelle für die Authentifizierung
import { LoginDto } from '../models/dtos/login.dto';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = `${environment.api.baseUrl}/auth`; // Endpunkt für Auth (Login und Registrierung)

  constructor(private http: HttpClient) {}

  // Registrierung
  register(registerData: RegisterDto): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, registerData).pipe(
      catchError(this.handleError) // Fehlerbehandlung
    );
  }

  // Anmeldung
  login(loginData: LoginDto): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, loginData).pipe(
      catchError(this.handleError) // Fehlerbehandlung
    );
  }

  // Token speichern
  saveToken(token: string): void {
    localStorage.setItem('jwtToken', token);
  }

  // Token abrufen
  getToken(): string | null {
    return localStorage.getItem('jwtToken');
  }

  // Token löschen (Logout)
  logout(): void {
    localStorage.removeItem('jwtToken');
  }

  // Fehlerbehandlung
  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('Ein Fehler ist aufgetreten:', error); // Fehlerausgabe im Debugging
    const errorMessage = error?.message || 'Etwas ist schiefgelaufen. Bitte versuchen Sie es später erneut.';
    return throwError(() => new Error(errorMessage));
  }
}
