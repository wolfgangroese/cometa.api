// src/app/services/skill.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable, of, throwError} from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment.dev';
import { Skill } from '../models/skill.model';

@Injectable({
  providedIn: 'root'
})
export class SkillService {
  private apiUrl = `${environment.api.baseUrl}/skills`;
  // Cache for autocomplete
  private skillsCache: Skill[] = [];

  constructor(private http: HttpClient) {}

  getSkills(): Observable<Skill[]> {
    return this.http.get<Skill[]>(this.apiUrl).pipe(
      tap(skills => {
        this.skillsCache = skills;
      }),
      catchError(this.handleError<Skill[]>('getSkills', []))
    );
  }

  getSkill(id: string): Observable<Skill> {
    return this.http.get<Skill>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError<Skill>(`getSkill id=${id}`))
    );
  }

  createSkill(skill: Partial<Skill>): Observable<Skill> {
    return this.http.post<Skill>(this.apiUrl, skill).pipe(
      tap(newSkill => {
        this.skillsCache.push(newSkill);
      }),
      catchError(this.handleError<Skill>('createSkill'))
    );
  }

  updateSkill(id: string, skill: Skill): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, skill).pipe(
      tap(() => {
        const index = this.skillsCache.findIndex(s => s.id === id);
        if (index !== -1) {
          this.skillsCache[index] = skill;
        }
      }),
      catchError(this.handleError<any>('updateSkill'))
    );
  }

  deleteSkill(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        this.skillsCache = this.skillsCache.filter(s => s.id !== id);
      }),
      catchError((error) => {
        // Propagate the error up instead of handling it here
        return throwError(() => error);
      })
    );
  }

  // Get tasks that are using a specific skill
  getTasksUsingSkill(skillId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${skillId}/tasks`).pipe(
      catchError((error) => {
        console.error('Error fetching tasks using skill:', error);
        return throwError(() => error);
      })
    );
  }

  // Autocomplete function to filter skills based on query
  searchSkills(query: string): Observable<Skill[]> {
    // If cache is empty, load skills first
    if (this.skillsCache.length === 0) {
      return this.getSkills().pipe(
        map(skills => this.filterSkills(skills, query))
      );
    }

    // Use cached data for quick filtering
    return of(this.filterSkills(this.skillsCache, query));
  }

  private filterSkills(skills: Skill[], query: string): Skill[] {
    query = query.toLowerCase().trim();
    return skills.filter(skill =>
      skill.name.toLowerCase().includes(query)
    );
  }

  // Get skill names array for easier usage in components
  getSkillNames(): Observable<string[]> {
    return this.getSkills().pipe(
      map(skills => skills.map(skill => skill.name))
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed:`, error);
      // Let the app keep running by returning an empty result
      return of(result as T);
    };
  }
}
