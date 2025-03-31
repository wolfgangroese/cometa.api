// Vollständige, bereinigte Version der TaskDetailComponent mit SkillNames für Backend

import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TaskService } from '../../../services/task.service';
import { CreateTaskDto, UpdateTaskDto, TaskStatus } from '../../../models/task.model';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { CalendarModule } from 'primeng/calendar';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ButtonGroupModule } from 'primeng/buttongroup';
import { FloatLabelModule } from 'primeng/floatlabel';
import { UserService } from '../../../services/user.service';
import { User } from '../../../models/user.model';
import { AuthService } from '../../../services/auth.service';
import { PermissionService } from '../../../services/permission.service';
import { AutoCompleteModule, AutoCompleteSelectEvent } from 'primeng/autocomplete';
import { ChipsModule } from 'primeng/chips';
import { SkillService } from '../../../services/skill.service';
import { Skill } from '../../../models/skill.model';

@Component({
  selector: 'app-task-detail',
  standalone: true,
  templateUrl: './task-detail.component.html',
  styleUrls: ['./task-detail.component.scss'],
  imports: [
    CommonModule,
    ButtonModule,
    ToastModule,
    CalendarModule,
    InputNumberModule,
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
  skillInput = '';
  skillSuggestions: Skill[] = [];

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
    private skillService: SkillService
  ) {}

  ngOnInit(): void {
    this.taskForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
      status: [this.statusOptions[3].value],
      rewards: [0],
      skills: [[]],
      startDate: [null],
      dueDate: [null],
      isCompleted: [false],
      assigneeId: [null]
    });

    this.taskId = this.route.snapshot.paramMap.get('id') || '';
    if (this.taskId) this.loadTask();
    this.loadUsers();
    this.currentUser = this.authService.getCurrentUserSync();
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
        const statusValue = this.mapStatusToValue(task.status);
        const skillNames: string[] = task.skills || [];
        const skillObjects: Skill[] = skillNames.map(name => ({ id: '', name }));

        this.taskForm.patchValue({
          name: task.name,
          description: task.description,
          rewards: task.rewards ?? 0,
          skills: skillObjects,
          startDate: task.startDate ? this.formatDate(task.startDate) : null,
          dueDate: task.dueDate ? this.formatDate(task.dueDate) : null,
          isCompleted: task.isCompleted,
          status: statusValue,
          assigneeId: task.assigneeId || null,
        });

        this.applyPermissionRestrictions();
      },
      error: (err) => {
        console.error('Fehler beim Laden der Task:', err);
        this.messageService.add({
          severity: 'error', summary: 'Fehler', detail: 'Die Task konnte nicht geladen werden.'
        });
      }
    });
  }

  private applyPermissionRestrictions(): void {
    if (!this.permissionService.canEditTaskProperties()) {
      Object.keys(this.taskForm.controls).forEach(key => {
        if (key !== 'status') {
          this.taskForm.get(key)?.disable();
        }
      });
    }
  }

  addSkill(event: AutoCompleteSelectEvent): void {
    const selectedSkill = event.value as Skill;
    const currentSkills: Skill[] = this.taskForm.get('skills')?.value || [];

    if (!currentSkills.some(s => s.id === selectedSkill.id)) {
      this.taskForm.patchValue({ skills: [...currentSkills, selectedSkill] });
    }
    this.skillInput = '';
  }

  searchSkills(event: { query: string }): void {
    const query = event.query.toLowerCase();
    this.skillService.searchSkills(query).subscribe(skills => {
      const currentSkills: Skill[] = this.taskForm.get('skills')?.value || [];
      const currentIds = currentSkills.map(s => s.id);
      this.skillSuggestions = skills.filter(skill => !currentIds.includes(skill.id));
    });
  }

  prepareCreateTaskData(): CreateTaskDto {
    const formData = this.taskForm.value;
    return {
      name: formData.name,
      description: formData.description,
      rewards: formData.rewards,
      skills: formData.skills ?? [],
      skillNames: (formData.skills ?? []).map((s: Skill) => s.name),
      startDate: formData.startDate ? new Date(formData.startDate).toISOString() : null,
      dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : null,
      status: this.mapValueToStatus(formData.status),
      assigneeId: formData.assigneeId || null,
    };
  }

  prepareUpdateTaskData(): UpdateTaskDto {
    const {
      name,
      description,
      rewards,
      skills,
      startDate,
      dueDate,
      status,
      assigneeId,
    } = this.taskForm.value;

    return {
      name,
      description,
      rewards,
      skillNames: (skills ?? []).map((s: Skill) => s.name), // ✅ nur das!
      startDate: startDate ? new Date(startDate).toISOString() : null,
      dueDate: dueDate ? new Date(dueDate).toISOString() : null,
      status: this.mapValueToStatus(status),
      assigneeId: assigneeId || null,
    };
  }


  addTask(): void {
    if (!this.permissionService.canCreateTasks()) return;
    if (this.taskForm.invalid) return;

    const newTask = this.prepareCreateTaskData();
    this.taskService.addTask(newTask).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Erfolg', detail: 'Neue Task erstellt!' });
        this.goBack();
      },
      error: (err) => {
        console.error('Erstellungsfehler:', err);
        this.messageService.add({ severity: 'error', summary: 'Fehler', detail: 'Erstellung fehlgeschlagen.' });
      }
    });
  }

  updateTask(): void {
    if (this.taskForm.invalid) return;

    const updatedTask = this.prepareUpdateTaskData();
    this.taskService.updateTask(this.taskId!, updatedTask).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Erfolg', detail: 'Task erfolgreich aktualisiert!' });
        this.goBack();
      },
      error: (err) => {
        console.error('Fehler beim Aktualisieren:', err);
        this.messageService.add({ severity: 'error', summary: 'Fehler', detail: 'Aktualisierung fehlgeschlagen.' });
      }
    });
  }

  pickTask(): void {
    const currentUser = this.authService.getCurrentUserSync();
    if (!currentUser) return;

    const description = this.taskForm.get('description')?.value || '';
    const now = new Date();
    const info = `\n\n- picked by ${currentUser.userName} on ${now.toLocaleString('de-DE')} -`;

    this.taskForm.patchValue({
      assigneeId: currentUser.id,
      status: 'In Progress',
      description: description + info
    });

    if (!this.permissionService.canEditTaskProperties()) {
      this.updateTaskStatusOnly();
    } else {
      this.updateTask();
    }
  }

  updateTaskStatusOnly(): void {
    const status = this.mapValueToStatus(this.taskForm.get('status')?.value);
    this.taskService.updateTaskStatus(this.taskId!, status).subscribe({
      next: () => this.goBack(),
      error: (err) => {
        console.error('Status-Update-Fehler:', err);
        this.messageService.add({ severity: 'error', summary: 'Fehler', detail: 'Status konnte nicht aktualisiert werden.' });
      }
    });
  }

  deleteTask(): void {
    if (!this.permissionService.canDeleteTasks()) return;

    this.taskService.deleteTask(this.taskId!).subscribe({
      next: () => this.goBack(),
      error: (err) => {
        console.error('Löschfehler:', err);
        this.messageService.add({ severity: 'error', summary: 'Fehler', detail: 'Löschen fehlgeschlagen.' });
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/tasks']).catch(err => console.error('Navigation fehlgeschlagen:', err));
  }

  isCurrentUserAssigned(): boolean {
    const user = this.authService.getCurrentUserSync();
    const assigneeId = this.taskForm.get('assigneeId')?.value;
    return user != null && assigneeId === user.id;
  }

  showPickButton(): boolean {
    return this.taskForm.get('status')?.value === 'Waiting' && !this.taskForm.get('assigneeId')?.value;
  }

  private formatDate(date: string | Date): string {
    return new Date(date).toISOString().split('T')[0];
  }

  private mapStatusToValue(status: TaskStatus | undefined): string {
    switch (status) {
      case TaskStatus.Done: return 'Done';
      case TaskStatus.InProgress: return 'In Progress';
      case TaskStatus.Blocked: return 'Blocked';
      case TaskStatus.Waiting: return 'Waiting';
      default: return 'Waiting';
    }
  }

  private mapValueToStatus(value: string): TaskStatus {
    switch (value) {
      case 'Done': return TaskStatus.Done;
      case 'In Progress': return TaskStatus.InProgress;
      case 'Blocked': return TaskStatus.Blocked;
      case 'Waiting': return TaskStatus.Waiting;
      default: return TaskStatus.Waiting;
    }
  }
}
