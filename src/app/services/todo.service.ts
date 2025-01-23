import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {lastValueFrom, Observable} from 'rxjs';
import { Todo } from '../models/todo.model';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private apiUrl = 'http://localhost:5092/todos';

  constructor(private http: HttpClient) { }


  async getTodos(): Promise<Todo[]> {
    return lastValueFrom(this.http.get<Todo[]>(this.apiUrl));
  }
  async getTodoById(id: string): Promise<Todo> {
    return lastValueFrom(this.http.get<Todo>(`${this.apiUrl}/${id}`));
  }

  addTodo(todo: Todo): Observable<any> {
    return this.http.post<Todo>(this.apiUrl, todo );
  }
  updateTodo(todo: Todo): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${todo.id}`, { updatedTodo: todo });
  }
}
