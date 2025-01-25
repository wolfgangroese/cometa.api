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

  // Todos abrufen
  getTodos(): Observable<Todo[]> {
    return this.http.get<Todo[]>(this.apiUrl).pipe(
      catchError(this.handleError) // Fehlerbehandlung
    );
  }

  // Einzelnes Todo abrufen
  getTodoById(id: string): Observable<Todo> {
    return this.http.get<Todo>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError) // Fehlerbehandlung
    );
  }

  // Neues Todo erstellen
  addTodo(todo: CreateTodoDto): Observable<Todo> {
    return this.http.post<Todo>(this.apiUrl, todo).pipe(
      catchError(this.handleError) // Fehlerbehandlung
    );
  }

  // Bestehendes Todo aktualisieren
  updateTodo(id: string, todo: UpdateTodoDto): Observable<Todo> {
    return this.http.put<Todo>(`${this.apiUrl}/${id}`, todo).pipe(
      catchError(this.handleError) // Fehlerbehandlung
    );
  }

  // Todo löschen
  deleteTodo(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError) // Fehlerbehandlung
    );
  }

  // Fehlerbehandlung
  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('Ein Fehler ist aufgetreten:', error); // Fehlerausgabe im Debugging
    const errorMessage = error?.message || 'Etwas ist schiefgelaufen. Bitte versuchen Sie es später erneut.';
    return throwError(() => new Error(errorMessage));
  }
}
