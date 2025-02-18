import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Task, CreateTaskDto, UpdateTaskDto } from '../models/task.model';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment.dev'; // Automatisches Ersetzen

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private apiUrl = `${environment.api.baseUrl}/tasks`; // Endpunkt für Tasks

  constructor(private http: HttpClient) {}

  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  getTaskById(id: string): Observable<Task> {
    return this.http.get<Task>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  addTask(task: CreateTaskDto): Observable<Task> {
    return this.http.post<Task>(this.apiUrl, task).pipe(
      catchError(this.handleError)
    );
  }

  updateTask(id: string, task: UpdateTaskDto): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}/${id}`, task).pipe(
      catchError(this.handleError)
    );
  }

  deleteTask(id: string): Observable<null> {
    return this.http.delete<null>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Etwas ist schiefgelaufen. Bitte versuchen Sie es später erneut.';

    if (error.error instanceof ErrorEvent) {
      // Client-seitiger Fehler (z. B. Netzwerkausfall)
      errorMessage = `Client-seitiger Fehler: ${error.error.message}`;
    } else {
      // Server-seitiger Fehler
      switch (error.status) {
        case 400:
          errorMessage = 'Ungültige Anfrage. Bitte überprüfen Sie Ihre Eingaben.';
          break;
        case 401:
          errorMessage = 'Nicht autorisiert. Bitte melden Sie sich an.';
          break;
        case 404:
          errorMessage = 'Task nicht gefunden.';
          break;
        case 500:
          errorMessage = 'Interner Serverfehler. Bitte versuchen Sie es später erneut.';
          break;
        default:
          errorMessage = `Server-Fehler (${error.status}): ${error.message}`;
      }
    }

    console.error('API-Fehler:', error);
    return throwError(() => new Error(errorMessage));
  }

}
