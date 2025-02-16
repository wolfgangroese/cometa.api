import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TodoService } from '../../../services/todo.service';
import { CreateTodoDto, UpdateTodoDto } from '../../../models/todo.model';
import { Button, ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { CalendarModule } from 'primeng/calendar';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { CheckboxModule } from "primeng/checkbox";
import { InputTextareaModule } from "primeng/inputtextarea";
import {ButtonGroupModule} from "primeng/buttongroup";
import {FloatLabelModule} from "primeng/floatlabel";


enum TodoStatus {
  Done = 'Done',
  InProgress = 'InProgress',
  Blocked = 'Blocked',
  Waiting = 'Waiting',
}

@Component({
  selector: 'app-todo-detail',
  standalone: true,
  templateUrl: './todo-detail.component.html',
  styleUrls: ['./todo-detail.component.scss'],
  imports: [
    CommonModule,
    Button,
    ToastModule,
    CalendarModule,
    InputNumberModule,
    ButtonModule,
    InputTextModule,
    DropdownModule,
    FormsModule,
    ReactiveFormsModule,
    CheckboxModule,
    InputTextareaModule,
    ButtonGroupModule,
    FloatLabelModule,
  ],
})
export class TodoDetailComponent implements OnInit {
  todoForm!: FormGroup;
  todoId: string | undefined;
  statusOptions = Object.values(TodoStatus);

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private todoService: TodoService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.todoForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
      status: [''],
      rewards: [0],
      skills: [[]], // Initialisiere Skills als leeres Array
      startDate: [null],
      dueDate: [null],
      isCompleted: [false],
    });

    this.todoId = this.route.snapshot.paramMap.get('id') || '';
    if (this.todoId) {
      this.loadTodo();
    }
  }

  loadTodo(): void {
    this.todoService.getTodoById(this.todoId!).subscribe({
      next: (todo) => {
        this.todoForm.patchValue({
          name: todo.name,
          description: todo.description,
          rewards: todo.rewards ?? 0,
          skills: todo.skills ?? [],
          startDate: todo.startDate ? this.formatDate(todo.startDate) : null,
          dueDate: todo.dueDate ? this.formatDate(todo.dueDate) : null,
          isCompleted: todo.isCompleted,
          status: todo.status !== undefined && todo.status !== null
            ? Object.values(TodoStatus)[todo.status]
            : TodoStatus.Waiting,


        });
      },
      error: (err) => {
        console.error('Fehler beim Laden der Todo:', err);
      },
    });
  }

  goBack(): void {
    this.router.navigate(['/todos']).catch((error) =>
      console.error('Fehler beim Navigieren zur Todo-Liste:', error)
    );
  }

  addTodo(): void {
    if (this.todoForm.valid) {
      const newTodo: CreateTodoDto = this.prepareCreateTodoData();
      this.todoService.addTodo(newTodo).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Erfolg',
            detail: 'Neues Todo erfolgreich erstellt!',
          });
          this.goBack();
        },
        error: (err) => {
          console.error('Fehler beim Erstellen des Todos:', err);
          this.messageService.add({
            severity: 'error',
            summary: 'Fehler',
            detail: 'Das Todo konnte nicht erstellt werden.',
          });
        },
      });
    }
  }


  updateTodo(): void {
    if (this.todoForm.valid) {
      console.log("✅ Formular-Werte vor dem Speichern:", this.todoForm.value);
      console.log("🛑 Hat das Formular 'isCompleted'?", this.todoForm.contains('isCompleted'));
      const updatedTodo: UpdateTodoDto = this.prepareUpdateTodoData();
      this.todoService.updateTodo(this.todoId!, updatedTodo).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Erfolg',
            detail: 'Todo erfolgreich aktualisiert!',
          });
          this.goBack();
        },
        error: (err) => {
          console.error('Fehler beim Aktualisieren des Todos:', err);
          this.messageService.add({
            severity: 'error',
            summary: 'Fehler',
            detail: 'Das Todo konnte nicht aktualisiert werden.',
          });
        },
      });
    }
  }

  deleteTodo(): void {
    if (this.todoId) {
      this.todoService.deleteTodo(this.todoId).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Erfolg',
            detail: 'Todo erfolgreich gelöscht!',
          });
          this.goBack();
        },
        error: (err) => {
          console.error('Fehler beim Löschen des Todos:', err);
          this.messageService.add({
            severity: 'error',
            summary: 'Fehler',
            detail: 'Das Todo konnte nicht gelöscht werden.',
          });
        },
      });
    }
  }

  private prepareCreateTodoData(): CreateTodoDto {
    const formData = this.todoForm.value;
    return {
      name: formData.name,
      description: formData.description,
      rewards: formData.rewards,
      skills: formData.skills || [], // Skills-Array verwenden oder leerlassen
      startDate: formData.startDate,
      dueDate: formData.dueDate,
      status: formData.status || TodoStatus.Waiting,
    };
  }

  private prepareUpdateTodoData(): UpdateTodoDto {
    const formData = this.todoForm.value;
    return {
      name: formData.name,
      description: formData.description,
      rewards: formData.rewards ?? 0,
      skills: formData.skills ?? [],
      startDate: formData.startDate,
      dueDate: formData.dueDate,
      isCompleted: formData.isCompleted ?? false,
      status: formData.status ? Object.keys(TodoStatus).indexOf(formData.status) : 0,
    };
  }

  private formatDate(date: string | Date): string {
    if (!date) return ''; // Falls `null` oder `undefined`, gibt es einen leeren String zurück

    // Falls es schon ein Date-Objekt ist, direkt umwandeln
    if (date instanceof Date) {
      return date.toISOString().split('T')[0]; // Konvertiert in "YYYY-MM-DD"
    }

    // Falls es ein String ist, zuerst in ein Date-Objekt umwandeln
    const parsedDate = new Date(date);
    return parsedDate.toISOString().split('T')[0];
  }



}
