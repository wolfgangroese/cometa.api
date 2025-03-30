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
    ButtonModule, // Changed to ButtonModule
    DropdownModule,
    PaginatorModule,
    ReactiveFormsModule
  ]
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];

  constructor(
    private taskService: TaskService,
    public permissionService: PermissionService // Public for use in template
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

  getStatusSeverity(status: number): string {
    const severityMap: Record<number, string> = {
      0: 'success', // Done
      1: 'info',    // InProgress
      2: 'danger',  // Blocked
      3: 'warning'  // Waiting
    };

    return severityMap[status] ?? 'info';
  }
}
