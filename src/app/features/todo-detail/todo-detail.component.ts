import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TodoService } from '../../services/todo.service';
import { Todo } from '../../models/todo.model';
import { Button } from "primeng/button";
import { ToastModule } from "primeng/toast";
import { MessageService } from "primeng/api";

@Component({
    selector: 'app-todo-detail',
    standalone: true,
    templateUrl: './todo-detail.component.html',
    styleUrls: ['./todo-detail.component.scss'],
    imports: [CommonModule, Button, ToastModule],
})
export class TodoDetailComponent implements OnInit {
  todoId: string | undefined ;
  todo: Todo | undefined;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private todoService: TodoService,
    private messageService: MessageService)
{}

  ngOnInit(): void {
    this.todoId = this.route.snapshot.paramMap.get('id') || '';
    console.log('Route Param ID:', this.todoId); // Debug: ID prüfen
    if (this.todoId) {
      this.todoService.getTodoById(this.todoId).subscribe({
        next: (todo) => {
          this.todo = todo;
          console.log('Loaded Todo:', this.todo); // Debug: Daten prüfen
        },
        error: (err) => {
          console.error('Fehler beim Laden der Todo:', err);
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

  addTodo(): void {
    this.router.navigate(['/todo/new']).then(success => {
      if (success) {
        console.log('Navigation to New Todo successful.');
      } else {
        console.error('Navigation to New Todo failed.');
      }
    }).catch(error => {
      console.error('Error during navigation to New Todo:', error);
    });
  }

  deleteTodo(todoId: string): void {
    console.log('deleteTodo gestartet. ID:', todoId);

    this.todoService.deleteTodo(todoId).subscribe({
      next: () => {
        const todoName = this.todo?.name || 'Unbekannt';

        console.log('Füge Toast hinzu.'); // Debug-Log
        this.messageService.add({
          severity: 'success',
          summary: 'Erfolg',
          detail: `Todo "${todoName}" erfolgreich gelöscht!`,
          life: 3000
        });
        console.log('Toast wurde hinzugefügt. Navigiere jetzt zurück.'); // Debug-Log

        this.goBack(); // Navigation
      },
      error: (err) => {
        console.error(`Fehler beim Löschen der Todo mit ID ${todoId}:`, err);

        console.log('Füge Fehler-Toast hinzu.'); // Debug-Log
        this.messageService.add({
          severity: 'error',
          summary: 'Fehler',
          detail: `Das Todo mit ID ${todoId} konnte nicht gelöscht werden.`
        });
      }
    });
  }



}
