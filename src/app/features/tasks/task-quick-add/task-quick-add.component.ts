import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../../../services/task.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-task-quick-add',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ToastModule,
    InputTextModule,
    ButtonModule
  ],
  templateUrl: './task-quick-add.component.html',
  styleUrls: ['./task-quick-add.component.scss'],
  providers: [MessageService]
})
export class TaskQuickAddComponent {
  // Aktueller Task-Input
  currentTaskName = '';

  // Liste der erstellten Tasks
  pendingTasks: string[] = [];

  // Liste der erfolgreich gespeicherten Tasks
  savedTasks: any[] = [];

  // Status für Erstellung (zeigt Ladeindikator)
  isCreating = false;

  constructor(
    private taskService: TaskService,
    private messageService: MessageService,
    private router: Router
  ) {}

  // Wird aufgerufen, wenn Enter gedrückt wird
  onEnterKey(event: Event): void {
    event.preventDefault();

    if (this.currentTaskName.trim()) {
      // Füge den aktuellen Task zur Liste hinzu
      this.pendingTasks.push(this.currentTaskName.trim());

      // Setze das Eingabefeld zurück
      this.currentTaskName = '';
    }
  }

  // Entfernt einen Task aus der Liste
  removeFromList(i: number): void {
    this.pendingTasks.splice(i, 1);
  }

  // Speichert alle Tasks in der Liste
  saveAllTasks(): void {
    if (this.pendingTasks.length === 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Keine Tasks',
        detail: 'Bitte gib mindestens einen Task ein.'
      });
      return;
    }

    this.isCreating = true;

    // Zähler für erfolgreiche Erstellungen
    let successCount = 0;
    let tasksToProcess = this.pendingTasks.length;

    // Erstelle jeden Task einzeln
    this.pendingTasks.forEach((taskName) => {
      // Erstelle die CreateTaskDto entsprechend dem API-Format
      const newTask = {
        name: taskName,
        description: 'Erstellt durch Schnellerfassung',
        startDate: new Date().toISOString(),
        dueDate: null,
        rewards: 1,
        isCompleted: false,
        status: 3,  // Waiting
        skillNames: [],
      };

      this.taskService.addTask(newTask).subscribe({
        next: (createdTask) => {
          this.savedTasks.push(createdTask);
          successCount++;

          // Prüfe, ob alle Tasks verarbeitet wurden
          if (successCount === this.pendingTasks.length) {
            this.pendingTasks = [];
            this.isCreating = false;

            this.messageService.add({
              severity: 'success',
              summary: 'Erfolg',
              detail: `${successCount} Tasks wurden erfolgreich erstellt.`
            });
          }
        },
        error: (err) => {
          console.error(`Fehler beim Erstellen von Task "${taskName}":`, err);

          this.messageService.add({
            severity: 'error',
            summary: 'Fehler',
            detail: `Task "${taskName}" konnte nicht erstellt werden.`
          });

          tasksToProcess--;

          // Prüfe, ob alle Tasks verarbeitet wurden
          if (successCount === tasksToProcess) {
            this.isCreating = false;
          }
        }
      });
    });
  }

  // Navigiert zur Task-Liste
  goToTaskList(): void {
    void this.router.navigate(['/tasks']);
  }
}
