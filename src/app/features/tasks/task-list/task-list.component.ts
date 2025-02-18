import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskService } from '../../../services/task.service';
import { Task } from '../../../models/task.model';
import {RouterLink} from "@angular/router";
import {CheckboxModule} from "primeng/checkbox";
import {TableModule} from "primeng/table";
import {TagModule} from "primeng/tag";
import {Button} from "primeng/button";
import {DropdownModule} from "primeng/dropdown";
import {PaginatorModule} from "primeng/paginator";
import {ReactiveFormsModule} from "@angular/forms";

@Component({
    selector: 'app-task-list',
    standalone: true,
    templateUrl: './task-list.component.html',
    styleUrls: ['./task-list.component.scss'],
  imports: [CommonModule, RouterLink, CheckboxModule, TableModule, TagModule, Button, DropdownModule, PaginatorModule, ReactiveFormsModule]
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];

  constructor(private taskService: TaskService) { }

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.taskService.getTasks().subscribe({
      next: (tasks) => {
        this.tasks = tasks;
      },
      error: (err) => {
        console.error('Fehler beim Laden der Tasks:', err);
      }
    });
  }

  getStatusLabel(status: number): string {
    const statusMap: Record<number, string> = {
      0: 'Done',
      1: 'In Progress',
      2: 'Blocked',
      3: 'Waiting'
    };

    return statusMap[status] ?? 'Unknown';
  }


}
