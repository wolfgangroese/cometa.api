// src/app/auth-test/auth-test.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment.dev';

@Component({
  selector: 'app-auth-test',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div style="padding: 20px;">
      <h2>Authentication Test</h2>

      <div style="margin: 20px 0;">
        <button (click)="testDirectAuth()" style="padding: 10px; margin-right: 10px; background: #4CAF50; color: white; border: none; border-radius: 4px;">
          Test Auth Directly
        </button>

        <button (click)="testNoAuthCheck()" style="padding: 10px; margin-right: 10px; background: #2196F3; color: white; border: none; border-radius: 4px;">
          Test Without Auth Check
        </button>

        <button (click)="logTokenInfo()" style="padding: 10px; background: #FFC107; color: black; border: none; border-radius: 4px;">
          Log Token Info
        </button>
      </div>

      <div *ngIf="result" style="margin-top: 20px; padding: 15px; background: #f5f5f5; border-radius: 4px;">
        <h3>Result:</h3>
        <pre style="overflow-x: auto;">{{ result | json }}</pre>
      </div>

      <div *ngIf="error" style="margin-top: 20px; padding: 15px; background: #ffebee; border-radius: 4px; color: #d32f2f;">
        <h3>Error:</h3>
        <pre style="overflow-x: auto;">{{ error | json }}</pre>
      </div>
    </div>
  `
})
export class AuthTestComponent {
  result: any = null;
  error: any = null;

  constructor(
    private authService: AuthService,
    private http: HttpClient
  ) {}

  testDirectAuth(): void {
    this.result = null;
    this.error = null;

    const token = localStorage.getItem('jwtToken');
    console.log('Testing direct auth with token:', token ? 'Token exists' : 'No token');

    if (!token) {
      this.error = { message: 'No token available' };
      return;
    }

    // Create headers manually to bypass interceptor
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    console.log('Authorization header created manually:', headers.get('Authorization'));

    // Make a direct request to the auth test endpoint
    this.http.get(`${environment.api.baseUrl}/tasks/auth-test`, { headers })
      .subscribe({
        next: (res) => {
          console.log('Direct auth test successful:', res);
          this.result = res;
        },
        error: (err) => {
          console.error('Direct auth test failed:', err);
          this.error = {
            status: err.status,
            statusText: err.statusText,
            message: err.message,
            error: err.error
          };
        }
      });
  }

  testNoAuthCheck(): void {
    this.result = null;
    this.error = null;

    const token = localStorage.getItem('jwtToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    // Add a new endpoint to your controller that doesn't require auth
    this.http.get(`${environment.api.baseUrl}/tasks/debug-roles`, { headers })
      .subscribe({
        next: (res) => {
          console.log('No auth check response:', res);
          this.result = res;
        },
        error: (err) => {
          console.error('No auth check error:', err);
          this.error = {
            status: err.status,
            statusText: err.statusText,
            message: err.message,
            error: err.error
          };
        }
      });
  }

  logTokenInfo(): void {
    this.result = null;
    this.error = null;

    const token = localStorage.getItem('jwtToken');
    if (!token) {
      this.error = { message: 'No token in localStorage' };
      return;
    }

    try {
      // Parse the token
      const parts = token.split('.');
      if (parts.length !== 3) {
        this.error = { message: 'Invalid token format - should have 3 parts' };
        return;
      }

      // Decode header and payload
      const header = JSON.parse(atob(parts[0]));
      const payload = JSON.parse(atob(parts[1]));

      this.result = {
        header,
        payload,
        tokenStart: token.substring(0, 15) + '...',
        tokenLength: token.length
      };
    } catch (e) {
      this.error = { message: 'Error parsing token', error: e };
    }
  }
}
