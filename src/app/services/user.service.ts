import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {map, Observable} from 'rxjs';
import { User } from '../models/user.model';
import { environment } from '../../environments/environment.dev';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${environment.api.baseUrl}/users`; // Adjust endpoint as needed

  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }
  getUserRewards(): Observable<number> {
    return this.http.get<{totalRewards: number}>(`${environment.api.baseUrl}/users/me/rewards`)
      .pipe(map(response => response.totalRewards));
  }
}
