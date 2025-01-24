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
import { Router, ActivatedRoute } from "@angular/router";
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
    TodoService,],
})
export class NewTodoComponent {
  todoForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router, private routes: ActivatedRoute,  private todoService: TodoService, private messageService: MessageService) {
    this.todoForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
      startDate: [null],
      dueDate: [null],
      rewards: [0, ],
      isCompleted: [false],
    });
  }

  onSubmit() {
    if (this.todoForm.valid) {
      const newTodo: Todo = this.todoForm.value; // Neue Task erstellen
      this.todoService.addTodo(newTodo).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Erfolg',
            detail: 'Todo wurde erfolgreich erstellt!'
          });
          this.todoForm.reset(); // Formular zurücksetzen
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Fehler',
            detail: 'Das Todo konnte nicht gespeichert werden.'
          });
        }
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/todos']).then(success => {
      if (success) {
        console.log('Navigation to Todo List successful.');
      } else {
        console.error('Navigation to Todo List failed.');
      }
    }).catch(error => {
      console.error('Error during navigation to Todo List:', error);
    });
  }
}
