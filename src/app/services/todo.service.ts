import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {lastValueFrom } from 'rxjs';
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

  async addTodo(todo: Todo): Promise<Todo> {
    return lastValueFrom(this.http.post<Todo>(this.apiUrl, todo));
  }
}
