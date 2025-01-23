import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { TodoService } from '../../services/todo.service';
import { Todo } from '../../models/todo.model';
import { InputGroupModule } from "primeng/inputgroup";
import { Button } from "primeng/button";
import { FloatLabelModule } from "primeng/floatlabel";
import { CalendarModule } from "primeng/calendar";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { InputTextModule } from "primeng/inputtext";
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-create-todo',
  templateUrl: './create-todo.component.html',
  styleUrls: ['./create-todo.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    InputGroupModule,
    Button,
    RouterLink,
    FloatLabelModule,
    CalendarModule,
    InputTextModule
  ]
})
export class CreateTodoComponent {
  todo: Todo = {
    id: '', // Leerer String oder erzeuge eine ID auf Serverseite
    name: '',
    description: '' ,
    startDate: new Date(),
    dueDate: new Date(),
    endDate: new Date(),
    rewards: 0,
    skills: [],
    isCompleted: false
  };

  constructor(private todoService: TodoService, private router: Router) {}

  onSubmit(): void {
    console.log('Todo before save:', this.todo); // Debugging

    const todoToSave: Todo = {
      ...this.todo,
      name: this.todo.name.trim(), // Leerzeichen entfernen
      description: this.todo.description?.trim(), // Leerzeichen entfernen

      startDate: this.todo.startDate
        ? new Date(this.todo.startDate)
        : new Date(), // Fallback auf aktuelles Datum
      dueDate: this.todo.dueDate
        ? new Date(this.todo.dueDate)
        : new Date(), // Fallback auf aktuelles Datum
    };

    console.log('Todo to save:', todoToSave); // Debugging

    this.todoService.addTodo(todoToSave).subscribe({
      next: (response) => {
        console.log('Todo created successfully:', response);
        this.router.navigate(['/todos']);
      },
      error: (error) => {
        console.error('Error creating todo:', error);
      },
    });
  }




}
