import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TodoService } from '../../services/todo.service';
import { Todo } from '../../models/todo.model';

@Component({
  selector: 'app-todo-detail',
  templateUrl: './todo-detail.component.html',
  styleUrls: ['./todo-detail.component.scss'],
  standalone: true,
  imports: [CommonModule], // Damit *ngIf, *ngFor usw. funktionieren
})
export class TodoDetailComponent implements OnInit {
  todoId: string | null = null;
  todo: Todo | null = null;

  constructor(private route: ActivatedRoute, private todoService: TodoService) {}

  async ngOnInit(): Promise<void> {
    this.todoId = this.route.snapshot.paramMap.get('id');
    console.log('Route Param ID:', this.todoId); // Debug: ID prüfen
    if (this.todoId) {
      this.todo = await this.todoService.getTodoById(this.todoId);
      console.log('Loaded Todo:', this.todo); // Debug: Daten prüfen
    }
  }
}
