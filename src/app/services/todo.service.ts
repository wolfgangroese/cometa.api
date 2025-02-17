import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Todo, CreateTodoDto, UpdateTodoDto } from '../models/todo.model';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment.dev'; // Automatisches Ersetzen

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  private apiUrl = `${environment.api.baseUrl}/todos`; // Endpunkt für Todos

  constructor(private http: HttpClient) {}

  getTodos(): Observable<Todo[]> {
    return this.http.get<Todo[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  getTodoById(id: string): Observable<Todo> {
    return this.http.get<Todo>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  addTodo(todo: CreateTodoDto): Observable<Todo> {
    return this.http.post<Todo>(this.apiUrl, todo).pipe(
      catchError(this.handleError)
    );
  }

  updateTodo(id: string, todo: UpdateTodoDto): Observable<Todo> {
    return this.http.put<Todo>(`${this.apiUrl}/${id}`, todo).pipe(
      catchError(this.handleError)
    );
  }

  deleteTodo(id: string): Observable<null> {
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
          errorMessage = 'Todo nicht gefunden.';
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
