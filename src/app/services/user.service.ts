import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, Observable, catchError, throwError } from 'rxjs';
import { User } from '../models/user.model';
import { environment } from '../../environments/environment.dev';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${environment.api.baseUrl}/users`;

  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  getUserRewards(): Observable<number> {
    const token = localStorage.getItem('jwtToken');
    console.log('Getting rewards with token:', token ? 'Yes' : 'No');

    // Manuelles Hinzufügen des Authorization-Headers
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<{totalRewards: number}>(
      `${this.apiUrl}/me/rewards`,
      { headers } // Dies ist entscheidend
    ).pipe(
      map(response => {
        console.log('Rewards response:', response);
        return response.totalRewards;
      }),
      catchError(error => {
        console.error('Error fetching rewards:', error);
        return throwError(() => error);
      })
    );
  }
}
