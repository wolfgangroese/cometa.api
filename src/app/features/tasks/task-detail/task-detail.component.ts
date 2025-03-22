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
import {ButtonGroupModule} from "primeng/buttongroup";
import {FloatLabelModule} from "primeng/floatlabel";


enum TaskStatus {
  Done = 'Done',
  InProgress = 'InProgress',
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

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private taskService: TaskService,
    private messageService: MessageService
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
    });

    this.taskId = this.route.snapshot.paramMap.get('id') || '';
    if (this.taskId) {
      this.loadTask();
    }
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
