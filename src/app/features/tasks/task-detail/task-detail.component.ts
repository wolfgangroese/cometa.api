import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TaskService } from '../../../services/task.service';
import { CreateTaskDto, UpdateTaskDto } from '../../../models/task.model';
import { Button, ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { CalendarModule } from 'primeng/calendar';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { CheckboxModule } from "primeng/checkbox";
import { InputTextareaModule } from "primeng/inputtextarea";
import { ButtonGroupModule } from "primeng/buttongroup";
import { FloatLabelModule } from "primeng/floatlabel";
import { UserService } from '../../../services/user.service';
import { User } from "../../../models/user.model";
import { AuthService} from "../../../services/auth.service";


enum TaskStatus {
  Done = 'Done',
  InProgress = 'In Progress',
  Blocked = 'Blocked',
  Waiting = 'Waiting',
}

@Component({
  selector: 'app-task-detail',
  standalone: true,
  templateUrl: './task-detail.component.html',
  styleUrls: ['./task-detail.component.scss'],
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
export class TaskDetailComponent implements OnInit {
  taskForm!: FormGroup;
  taskId: string | undefined;
  statusOptions = Object.values(TaskStatus);
  users: User[] = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private taskService: TaskService,
    private messageService: MessageService,
    private userService: UserService,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.taskForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
      status: [''],
      rewards: [0],
      skills: [[]], // Initialisiere Skills als leeres Array
      startDate: [null],
      dueDate: [null],
      isCompleted: [false],
      assigneeId: [null],
    });

    this.taskId = this.route.snapshot.paramMap.get('id') || '';
    if (this.taskId) {
      this.loadTask();
    }
    this.loadUsers();
  }
  loadUsers(): void {
    this.userService.getUsers().subscribe({
      next: (users) => {
        this.users = users;
      },
      error: (err) => {
        console.error('Error loading users:', err);
      }
    });
  }

  loadTask(): void {
    this.taskService.getTaskById(this.taskId!).subscribe({
      next: (task) => {
        this.taskForm.patchValue({
          name: task.name,
          description: task.description,
          rewards: task.rewards ?? 0,
          skills: task.skills ?? [],
          startDate: task.startDate ? this.formatDate(task.startDate) : null,
          dueDate: task.dueDate ? this.formatDate(task.dueDate) : null,
          isCompleted: task.isCompleted,
          status: task.status !== undefined && task.status !== null
            ? Object.values(TaskStatus)[task.status]
            : TaskStatus.Waiting,
          assigneeId: task.assigneeId || null,
        });
      },
      error: (err) => {
        console.error('Fehler beim Laden der Task:', err);
      },
    });
  }

  goBack(): void {
    this.router.navigate(['/tasks']).catch((error) =>
      console.error('Fehler beim Navigieren zur Task-Liste:', error)
    );
  }

  addTask(): void {
    if (this.taskForm.valid) {
      const newTask: CreateTaskDto = this.prepareCreateTaskData();
      this.taskService.addTask(newTask).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Erfolg',
            detail: 'Neues Task erfolgreich erstellt!',
          });
          this.goBack();
        },
        error: (err) => {
          console.error('Fehler beim Erstellen des Tasks:', err);
          this.messageService.add({
            severity: 'error',
            summary: 'Fehler',
            detail: 'Das Task konnte nicht erstellt werden.',
          });
        },
      });
    }
  }


  updateTask(): void {
    if (this.taskForm.valid) {
      console.log("✅ Formular-Werte vor dem Speichern:", this.taskForm.value);
      console.log("🛑 Hat das Formular 'isCompleted'?", this.taskForm.contains('isCompleted'));
      const updatedTask: UpdateTaskDto = this.prepareUpdateTaskData();
      this.taskService.updateTask(this.taskId!, updatedTask).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Erfolg',
            detail: 'Task erfolgreich aktualisiert!',
          });
          this.goBack();
        },
        error: (err) => {
          console.error('Fehler beim Aktualisieren des Tasks:', err);
          this.messageService.add({
            severity: 'error',
            summary: 'Fehler',
            detail: 'Das Task konnte nicht aktualisiert werden.',
          });
        },
      });
    }
  }

  deleteTask(): void {
    if (this.taskId) {
      this.taskService.deleteTask(this.taskId).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Erfolg',
            detail: 'Task erfolgreich gelöscht!',
          });
          this.goBack();
        },
        error: (err) => {
          console.error('Fehler beim Löschen des Tasks:', err);
          this.messageService.add({
            severity: 'error',
            summary: 'Fehler',
            detail: 'Das Task konnte nicht gelöscht werden.',
          });
        },
      });
    }
  }

  private prepareCreateTaskData(): CreateTaskDto {
    const formData = this.taskForm.value;
    return {
      ...formData,
      name: formData.name,
      description: formData.description,
      rewards: formData.rewards,
      skills: formData.skills || [], // Skills-Array verwenden oder leerlassen
      startDate: formData.startDate ? new Date(formData.startDate).toISOString() : null,
      dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : null,
      status: formData.status ? Object.keys(TaskStatus).indexOf(formData.status) : 0,
      assigneeId: formData.assigneeId || null,
    };
  }

  private prepareUpdateTaskData(): UpdateTaskDto {
    const formData = this.taskForm.value;
    return {
      name: formData.name,
      description: formData.description,
      rewards: formData.rewards ?? 0,
      skills: formData.skills ?? [],
      startDate: formData.startDate ? new Date(formData.startDate).toISOString() : null,
      dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : null,
      isCompleted: formData.isCompleted ?? false,
      status: formData.status ? Object.keys(TaskStatus).indexOf(formData.status) : 0,
      assigneeId: formData.assigneeId || null,
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


// Prüft, ob der aktuell eingeloggte User bereits der Assignee ist
  isCurrentUserAssigned(): boolean {
    const currentUser = this.authService.getCurrentUserSync();
    if (!currentUser || !this.taskForm.get('assigneeId')?.value) {
      return false;
    }
    return this.taskForm.get('assigneeId')?.value === currentUser.id;
  }

// Task vom aktuellen User übernehmen
  pickTask(): void {
    const currentUser = this.authService.getCurrentUserSync();
    if (!currentUser) {
      this.messageService.add({
        severity: 'error',
        summary: 'Fehler',
        detail: 'Du musst eingeloggt sein, um diese Task zu übernehmen.'
      });
      return;
    }

    // Aktuelles Datum und Zeit formatieren
    const now = new Date();
    const dateTimeString = now.toLocaleString('de-DE');

    // Aktuellen Beschreibungstext holen
    const currentDescription = this.taskForm.get('description')?.value || '';

    // Neue Zeile mit Übernahmeinformation hinzufügen
    const pickInfo = `\n\n- picked by ${currentUser.userName} on ${dateTimeString} -`;
    const updatedDescription = currentDescription + pickInfo;

    // Formular aktualisieren
    this.taskForm.patchValue({
      assigneeId: currentUser.id,
      status: 'InProgress',
      description: updatedDescription
    });

    // Task sofort mit den neuen Werten speichern
    this.updateTask();

    this.messageService.add({
      severity: 'success',
      summary: 'Task übernommen',
      detail: `Du hast die Task "${this.taskForm.get('name')?.value}" erfolgreich übernommen.`
    });
  }
  /**
   * Bestimmt, ob der Pick-Button angezeigt werden soll
   * @returns true wenn der Button angezeigt werden soll, sonst false
   */
  showPickButton(): boolean {
    // Den aktuellen Status holen (beachte dass es ein String oder ein enum sein könnte)
    const currentStatus = this.taskForm.get('status')?.value;

    // Debug-Ausgabe
    console.log('Current status:', currentStatus);
    console.log('Current user assigned:', this.isCurrentUserAssigned());

    // Prüfen ob es 'Waiting' ist - verschiedene Werte beachten
    return !this.isCurrentUserAssigned() &&
      (currentStatus === 'Waiting' ||
        currentStatus === 3 ||      // Numerischer Wert in Enumeration
        currentStatus?.toString().toLowerCase() === 'waiting');
  }
}
