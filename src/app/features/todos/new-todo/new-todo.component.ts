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
import { Todo } from "../../../models/todo.model";
import { TodoService } from "../../../services/todo.service";
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
      startDate: [this.getTodayDate()],  // Standardwert: Heute
      dueDate: [this.getFutureDate(5)], // Standardwert: Heute + 5 Tage
      rewards: [1],
      isCompleted: [false],
    });
  }

  onSubmit(): void {
    if (this.todoForm.valid) {
      const newTodo: Todo = this.prepareTodoData(); // Daten vorbereiten
      console.log('📤 Gesendete Daten:', newTodo); // Debugging

      this.todoService.addTodo(newTodo).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Erfolg',
            detail: 'Todo wurde erfolgreich erstellt!',
          });

          // Formular zurücksetzen und Standardwerte beibehalten
          this.todoForm.reset({
            name: '',
            description: '',
            startDate: this.getTodayDate(),
            dueDate: this.getFutureDate(5),
            rewards: [1],
            isCompleted: false,
          });
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
      startDate: this.convertDate(formData.startDate),
      dueDate: this.convertDate(formData.dueDate),
    };
  }

  private getTodayDate(): string {
    return new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD für <input type="date">
  }

  private getFutureDate(days: number): string {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + days);
    return futureDate.toISOString().split('T')[0];
  }

  private convertDate(date: any): string | null {
    return date ? new Date(date).toISOString() : null;
  }
}
