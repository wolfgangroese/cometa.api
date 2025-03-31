import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskService } from '../../../services/task.service';
import { Task } from '../../../models/task.model';
import { RouterLink } from "@angular/router";
import { CheckboxModule } from "primeng/checkbox";
import { TableModule } from "primeng/table";
import { TagModule } from "primeng/tag";
import { ButtonModule } from "primeng/button"; // Changed from importing Button
import { DropdownModule } from "primeng/dropdown";
import { PaginatorModule } from "primeng/paginator";
import { ReactiveFormsModule } from "@angular/forms";
import { PermissionService } from "../../../services/permission.service";
import { MessageService } from "primeng/api";
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { FilterService } from "primeng/api";
import { InputTextModule } from "primeng/inputtext";
import { MultiSelectModule } from "primeng/multiselect";
import { CalendarModule } from "primeng/calendar";
import { TooltipModule } from "primeng/tooltip";

@Component({
  selector: 'app-task-list',
  standalone: true,
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss'],
  imports: [
    CommonModule,
    RouterLink,
    CheckboxModule,
    TableModule,
    TagModule,
    ButtonModule,
    DropdownModule,
    PaginatorModule,
    ReactiveFormsModule,
    ToastModule,
    ConfirmDialogModule,
    InputTextModule,
    MultiSelectModule,
    CalendarModule,
    TooltipModule,
  ],
  providers: [MessageService, ConfirmationService, FilterService],
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];

  statusOptions = [
    { label: 'Done', value: 0 },
    { label: 'In Progress', value: 1 },
    { label: 'Blocked', value: 2 },
    { label: 'Waiting', value: 3 }
  ];

  constructor(
    private taskService: TaskService,
    public permissionService: PermissionService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.taskService.getTasks().subscribe({
      next: (tasks) => {
        console.log('Tasks loaded successfully:', tasks);
        this.tasks = tasks;
      },
      error: (err) => {
        console.error('Error loading tasks:', err);
      }
    });
  }

  getStatusLabel(status: number): string {
    const statusMap: Record<number, string> = {
      0: 'Done',
      1: 'InProgress',
      2: 'Blocked',
      3: 'Waiting'
    };

    return statusMap[status] ?? 'Unknown';
  }

  deleteTask(id: string): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this task?',
      accept: () => {
        this.taskService.deleteTask(id).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Task deleted successfully'
            });
            this.loadTasks();
          },
          error: (err) => {
            console.error('Error deleting task:', err);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to delete task'
            });
          }
        });
      }
    });
  }

  getStatusSeverity(status: number): string {
    const severityMap: Record<number, string> = {
      0: 'success', // Done
      1: 'info',    // InProgress
      2: 'danger',  // Blocked
      3: 'warning'  // Waiting
    };

    return severityMap[status] ?? 'info';
  }

  protected readonly HTMLInputElement = HTMLInputElement;

}
