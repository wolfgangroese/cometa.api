import { Component, OnInit } from '@angular/core';
import {CommonModule} from "@angular/common";
import {Todo} from "../../models/todo.model";
import {TodoService} from "../../services/todo.service";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  todos: Todo[] = [];
  taskCount: number = 0;

  constructor(private todoService: TodoService) { }

  ngOnInit(): void {
    this.loadTodos().then(() => this.updateTaskCount());
    this.taskCount = this.todos?.length;
  }

  async  loadTodos(): Promise <void> {
    try {
      this.todos = await this.todoService.getTodos();
      this.taskCount = this.todos.length;
    } catch(error) {
      console.error('Failed to load todos', error);
      this.todos = [];
      this.taskCount = 0;
  }
}

  private updateTaskCount() {
    return undefined;
  }}

