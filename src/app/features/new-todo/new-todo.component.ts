import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { PanelModule } from "primeng/panel";
import { Todo } from "../../models/todo.model";
import { TodoService } from "../../services/todo.service";
import { Router } from "@angular/router";
import { InputTextareaModule } from "primeng/inputtextarea";

@Component({
  selector: 'app-new-todo',
  templateUrl: './new-todo.component.html',
  styleUrls: ['./new-todo.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    CalendarModule,
    ButtonModule,
    CheckboxModule,
    ToastModule,
    PanelModule,
    InputTextareaModule,
  ],
  providers: [
    MessageService,
    TodoService,
  ],
})
export class NewTodoComponent {
  todoForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private todoService: TodoService,
    private messageService: MessageService
  ) {
    this.todoForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
      startDate: [null],
      dueDate: [null],
      rewards: [0],
      isCompleted: [false],
    });
  }

  onSubmit(): void {
    if (this.todoForm.valid) {
      const newTodo: Todo = this.prepareTodoData(); // Daten vorbereiten
      console.log('Gesendete Daten:', newTodo); // Debug: Zu sendende Daten prüfen

      this.todoService.addTodo(newTodo).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Erfolg',
            detail: 'Todo wurde erfolgreich erstellt!',
          });
          this.todoForm.reset({
            name: '',
            description: '',
            startDate: null,
            dueDate: null,
            rewards: 0,
            isCompleted: false,
          }); // Standardwerte nach Reset
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Fehler',
            detail: 'Das Todo konnte nicht gespeichert werden.',
          });
        },
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/todos']).catch((error) =>
      console.error('Fehler beim Navigieren zur Todo-Liste:', error)
    );
  }

  private prepareTodoData(): Todo {
    const formData = this.todoForm.value;
    return {
      ...formData,
      startDate: formData.startDate ? new Date(formData.startDate).toISOString() : null,
      dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : null,
    };
  }
}
