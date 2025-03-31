import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TaskService } from '../../../services/task.service';
import { CreateTaskDto, UpdateTaskDto, TaskStatus } from '../../../models/task.model';
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
import { AuthService } from "../../../services/auth.service";
import { PermissionService } from "../../../services/permission.service";
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ChipsModule } from 'primeng/chips';

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
    AutoCompleteModule,
    ChipsModule
  ],
  providers: [MessageService]
})
export class TaskDetailComponent implements OnInit {
  taskForm!: FormGroup;
  taskId: string | undefined;
  users: User[] = [];
  currentUser?: User | null = null;
  originalStatus?: TaskStatus;

  statusOptions = [
    { label: 'Done', value: 'Done' },
    { label: 'In Progress', value: 'In Progress' },
    { label: 'Blocked', value: 'Blocked' },
    { label: 'Waiting', value: 'Waiting' }
  ];
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private taskService: TaskService,
    private messageService: MessageService,
    private userService: UserService,
    private authService: AuthService,
    public permissionService: PermissionService,
  ) {}

  ngOnInit(): void {
    this.taskForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
      status: [this.statusOptions[3].value], // Standardwert 'Waiting'
      rewards: [0],
      skills: [[]],
      skillNames: [[]], // 🆕 hier landen die Chips
      startDate: [null],
      dueDate: [null],
      isCompleted: [false],
      assigneeId: [null],
      effortMin: [0],
      effortMax: [1],
    });

    this.taskId = this.route.snapshot.paramMap.get('id') || '';
    if (this.taskId) this.loadTask();
    this.loadUsers();

    this.currentUser = this.authService.getCurrentUserSync();
    console.log('Aktueller User:', this.authService.getCurrentUserSync());

  }

  loadUsers(): void {
    this.userService.getUsers().subscribe({
      next: (users) => this.users = users,
      error: (err) => console.error('Error loading users:', err)
    });
  }

  loadTask(): void {
    if (!this.taskId) return;

    this.taskService.getTaskById(this.taskId).subscribe({
      next: (task) => {
        this.originalStatus = task.status;
        let statusValue;
        switch(task.status) {
          case TaskStatus.Done: statusValue = 'Done'; break;
          case TaskStatus.InProgress: statusValue = 'In Progress'; break;
          case TaskStatus.Blocked: statusValue = 'Blocked'; break;
          case TaskStatus.Waiting: statusValue = 'Waiting'; break;
          default: statusValue = 'Waiting';
        }

        this.taskForm.patchValue({
          name: task.name,
          description: task.description,
          rewards: task.rewards ?? 0,
          skills: task.skills ?? [],
          skillNames: task.skills ?? [],
          startDate: task.startDate ? this.formatDate(task.startDate) : null,
          dueDate: task.dueDate ? this.formatDate(task.dueDate) : null,
          isCompleted: task.isCompleted,
          status: statusValue,
          assigneeId: task.assigneeId || null,
          effortMin: task.effortMin ?? 0,
          effortMax: task.effortMax ?? 1,
        });

        this.applyPermissionRestrictions();
      },
      error: (err) => {
        console.error('Fehler beim Laden der Task:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Fehler',
          detail: 'Die Task konnte nicht geladen werden.'
        });
      },
    });
  }

  /**
   * Apply form field restrictions based on user permissions
   */
  private applyPermissionRestrictions(): void {
    // Only allow status changes for regular users
    if (!this.permissionService.canEditTaskProperties()) {
      // Disable all form controls except status
      Object.keys(this.taskForm.controls).forEach(key => {
        if (key !== 'status') {
          this.taskForm.get(key)?.disable();
        }
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/tasks']).catch((error) =>
      console.error('Fehler beim Navigieren zur Task-Liste:', error)
    );
  }

  addTask(): void {
    if (!this.permissionService.canCreateTasks()) {
      this.messageService.add({
        severity: 'error',
        summary: 'Keine Berechtigung',
        detail: 'Sie haben keine Berechtigung, neue Tasks zu erstellen.'
      });
      return;
    }

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
    if (this.taskForm.invalid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Fehler',
        detail: 'Bitte füllen Sie alle erforderlichen Felder aus.'
      });
      return;
    }

    // If user can only edit status, use the status-only endpoint
    if (!this.permissionService.canEditTaskProperties()) {
      this.updateTaskStatusOnly();
      return;
    }

    // Otherwise, do a full update
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

  /**
   * Update only the status field (for Performer role)
   */
  private updateTaskStatusOnly(): void {
    const statusValue = this.taskForm.get('status')?.value;

    // Convert string status to enum value
    let statusEnum: TaskStatus;
    switch(statusValue) {
      case 'Done': statusEnum = TaskStatus.Done; break;
      case 'In Progress': statusEnum = TaskStatus.InProgress; break;
      case 'Blocked': statusEnum = TaskStatus.Blocked; break;
      case 'Waiting': statusEnum = TaskStatus.Waiting; break;
      default:
        this.messageService.add({
          severity: 'error',
          summary: 'Fehler',
          detail: 'Ungültiger Status.'
        });
        return;
    }

    if (!this.taskId) {
      this.messageService.add({
        severity: 'error',
        summary: 'Fehler',
        detail: 'Task-ID fehlt.'
      });
      return;
    }

    // Use a dedicated endpoint just for status updates
    this.taskService.updateTaskStatus(this.taskId, statusEnum).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Erfolg',
          detail: 'Status erfolgreich aktualisiert!'
        });
        this.goBack();
      },
      error: (err: Error) => {
        console.error('Fehler beim Aktualisieren des Status:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Fehler',
          detail: 'Der Status konnte nicht aktualisiert werden.'
        });
      }
    });
  }

  deleteTask(): void {
    if (!this.permissionService.canDeleteTasks()) {
      this.messageService.add({
        severity: 'error',
        summary: 'Keine Berechtigung',
        detail: 'Sie haben keine Berechtigung, Tasks zu löschen.'
      });
      return;
    }

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

    let statusEnum: TaskStatus;
    switch(formData.status) {
      case 'Done': statusEnum = TaskStatus.Done; break;
      case 'In Progress': statusEnum = TaskStatus.InProgress; break;
      case 'Blocked': statusEnum = TaskStatus.Blocked; break;
      case 'Waiting': statusEnum = TaskStatus.Waiting; break;
      default: statusEnum = TaskStatus.Waiting;
    }

    return {
      name: formData.name,
      description: formData.description,
      rewards: formData.rewards,
      skills: formData.skills || [],
      skillNames: formData.skillNames || [], // 🆕 hinzugefügt
      startDate: formData.startDate ? new Date(formData.startDate).toISOString() : null,
      dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : null,
      status: statusEnum,
      assigneeId: formData.assigneeId || null,
      effortMin: formData.effortMin || 0,
      effortMax: formData.effortMax || 1,
    };
  }

  private prepareUpdateTaskData(): UpdateTaskDto {
    const formData = this.taskForm.value;

    let statusEnum: TaskStatus;
    switch(formData.status) {
      case 'Done': statusEnum = TaskStatus.Done; break;
      case 'In Progress': statusEnum = TaskStatus.InProgress; break;
      case 'Blocked': statusEnum = TaskStatus.Blocked; break;
      case 'Waiting': statusEnum = TaskStatus.Waiting; break;
      default: statusEnum = TaskStatus.Waiting;
    }

    return {
      name: formData.name,
      description: formData.description,
      rewards: formData.rewards ?? 0,
      skills: formData.skills ?? [],
      skillNames: formData.skillNames || [], // 🆕 hinzugefügt
      startDate: formData.startDate ? new Date(formData.startDate).toISOString() : null,
      dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : null,
      isCompleted: formData.isCompleted ?? false,
      status: statusEnum,
      assigneeId: formData.assigneeId || null,
      effortMin: formData.effortMin ?? 0,
      effortMax: formData.effortMax ?? 1,

    };
  }

  private formatDate(date: string | Date): string {
    if (!date) return '';

    if (date instanceof Date) {
      return date.toISOString().split('T')[0];
    }

    const parsedDate = new Date(date);
    return parsedDate.toISOString().split('T')[0];
  }



  // Check if the current user is assigned to this task
  isCurrentUserAssigned(): boolean {
    const currentUser = this.authService.getCurrentUserSync();
    if (!currentUser || !this.taskForm.get('assigneeId')?.value) {
      return false;
    }
    return this.taskForm.get('assigneeId')?.value === currentUser.id;
  }



  // Task assignment for current user
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

    // Format current date and time
    const now = new Date();
    const dateTimeString = now.toLocaleString('de-DE');

    // Get current description
    const currentDescription = this.taskForm.get('description')?.value || '';

    // Add assignment info
    const pickInfo = `\n\n- picked by ${currentUser.userName} on ${dateTimeString} -`;
    const updatedDescription = currentDescription + pickInfo;

    // Update form values
    this.taskForm.patchValue({
      assigneeId: currentUser.id,
      status: 'In Progress', // Use string value from statusOptions
      description: updatedDescription,
      skillNames: this.taskForm.get('skillNames') ?.value ?? [],
    });
    console.log('SkillNames im Form:', this.taskForm.get('skillNames')?.value);


    // If user is Performer, just update status
    if (!this.permissionService.canEditTaskProperties()) {
      this.updateTaskStatusOnly();
      return;
    }

    // Otherwise update all task properties
    this.updateTask();
  }

  /**
   * Determines if the Pick button should be displayed
   */
  showPickButton(): boolean {
    const currentStatus = this.taskForm.get('status')?.value;

    // Task must be in Waiting status and not assigned
    const isWaiting = currentStatus === 'Waiting';

    const assigneeId = this.taskForm.get('assigneeId')?.value;

    return isWaiting && !assigneeId && !this.isCurrentUserAssigned();
  }

}
