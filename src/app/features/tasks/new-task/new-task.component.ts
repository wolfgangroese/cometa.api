import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { PanelModule } from "primeng/panel";
import { Task } from "../../../models/task.model";
import { TaskService } from "../../../services/task.service";
import { Router } from "@angular/router";
import { InputTextareaModule } from "primeng/inputtextarea";
import { DropdownModule } from "primeng/dropdown";
import { FloatLabelModule } from "primeng/floatlabel";
import { UserService } from '../../../services/user.service';
import { User } from "../../../models/user.model";
import {ChipsModule} from "primeng/chips";
import {InputNumberModule} from "primeng/inputnumber";

enum TaskStatus {
  Done = 'Done',
  InProgress = 'In Progress',
  Blocked = 'Blocked',
  Waiting = 'Waiting',
}

@Component({
  selector: 'app-new-task',
  templateUrl: './new-task.component.html',
  styleUrls: ['./new-task.component.scss'],
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
    DropdownModule,
    FloatLabelModule,
    ChipsModule,
    InputNumberModule,
  ],
  providers: [
    MessageService,
    TaskService,
  ],
})
export class NewTaskComponent implements OnInit {
  taskForm: FormGroup;
  statusOptions = [
    { label: 'Done', value: 'Done' },
    { label: 'In Progress', value: 'In Progress' },
    { label: 'Blocked', value: 'Blocked' },
    { label: 'Waiting', value: 'Waiting' }
  ];
  users: User[] = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private taskService: TaskService,
    private messageService: MessageService,
    private userService: UserService
  ) {
    this.taskForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
      startDate: [this.getTodayDate()],  // Standardwert: Heute
      dueDate: [this.getFutureDate(5)], // Standardwert: Heute + 5 Tage
      rewards: [1],
      isCompleted: [false],
      status: [TaskStatus.Waiting],
      assigneeId: [null],
      skillNames: [[]],
      effortMin: [0],
      effortMax: [1],
    });
  }

  ngOnInit(): void {
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

  onSubmit(): void {
    if (this.taskForm.valid) {
      const newTask: Task = this.prepareTaskData();
      console.log('📤 Gesendete Daten:', newTask);

      this.taskService.addTask(newTask).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Erfolg',
            detail: 'Task wurde erfolgreich erstellt!',
          });

          // Formular zurücksetzen und Standardwerte beibehalten
          this.taskForm.reset({
            name: '',
            description: '',
            startDate: this.getTodayDate(),
            dueDate: this.getFutureDate(5),
            rewards: 1,
            isCompleted: false,
            status: TaskStatus.Waiting,
            assigneeId: null,
          });
        },
        error: (err) => {
          console.error('Fehler beim Speichern:', err);
          this.messageService.add({
            severity: 'error',
            summary: 'Fehler',
            detail: 'Das Task konnte nicht gespeichert werden.',
          });
        },
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/tasks']).catch((error) =>
      console.error('Fehler beim Navigieren zur Task-Liste:', error)
    );
  }

  private prepareTaskData(): Task {
    const formData = this.taskForm.value;
    return {
      ...formData,
      startDate: this.convertDate(formData.startDate),
      dueDate: this.convertDate(formData.dueDate),
      status: formData.status ? Object.keys(TaskStatus).indexOf(formData.status) : 3, // Default to Waiting (3)
      assigneeId: formData.assigneeId,
      effortMin: formData.effortMin || 0,
      effortMax: formData.effortMax || 1,
      skillNames: formData.skillNames || []
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
