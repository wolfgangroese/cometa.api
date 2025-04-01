import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Task, CreateTaskDto, UpdateTaskDto, TaskStatus } from '../models/task.model';
import {catchError, tap} from 'rxjs/operators';
import { environment } from '../../environments/environment.dev';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private apiUrl = `${environment.api.baseUrl}/tasks`;

  constructor(private http: HttpClient) {}

  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.apiUrl).pipe(
      tap(tasks => console.log('Tasks retrieved successfully:', tasks)),
      catchError(error => {
        console.error('Error in getTasks:', error);
        return throwError(() => error);
      })
    );
  }

  getTaskById(id: string): Observable<Task> {
    return this.http.get<Task>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }


  addTask(task: CreateTaskDto): Observable<Task> {
    return this.http.post<Task>(this.apiUrl, task).pipe(
      catchError(this.handleError)
    );
  }

  duplicateTask(taskDto: CreateTaskDto) {
    return this.http.post('/api/tasks/duplicate', { newTaskDto: taskDto });
  }


  updateTask(id: string, task: UpdateTaskDto): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}/${id}`, task).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Update only the status of a task
   * This endpoint is accessible to all authenticated users including Performers
   * @param id Task ID
   * @param status New status value (as enum number)
   */
  updateTaskStatus(id: string, status: TaskStatus): Observable<unknown> {
    return this.http.patch<unknown>(
      `${this.apiUrl}/${id}/status`,
      { status } // Using the minimal DTO
    ).pipe(
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
      // Client-side error
      errorMessage = `Client-seitiger Fehler: ${error.error.message}`;
    } else {
      // Server-side error
      switch (error.status) {
        case 400:
          errorMessage = 'Ungültige Anfrage. Bitte überprüfen Sie Ihre Eingaben.';
          break;
        case 401:
          errorMessage = 'Nicht autorisiert. Bitte melden Sie sich an.';
          break;
        case 403:
          errorMessage = 'Zugriff verweigert. Sie haben nicht die erforderlichen Berechtigungen.';
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
