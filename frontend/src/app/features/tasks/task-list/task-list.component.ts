import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskService } from '../../../services/task.service';
import { Task } from '../../../models/task.model';
import { RouterLink } from "@angular/router";
import { CheckboxModule } from "primeng/checkbox";
import { TableModule } from "primeng/table";
import { TagModule } from "primeng/tag";
import { ButtonModule } from "primeng/button";
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
import { ChipModule } from "primeng/chip";
import { OverlayPanelModule } from "primeng/overlaypanel";
import { TranslateService, TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-task-list',
  standalone: true,
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
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
    ChipModule,
    OverlayPanelModule,
    TranslateModule, // Make sure TranslateModule is imported
  ],
  providers: [MessageService, ConfirmationService, FilterService],
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];

  statusOptions = [
    { label: 'TASK.STATUSOPTION.DONE', value: 0 },
    { label: 'TASK.STATUSOPTION.IN_PROGRESS', value: 1 },
    { label: 'TASK.STATUSOPTION.BLOCKED', value: 2 },
    { label: 'TASK.STATUSOPTION.WAITING', value: 3 }
  ];

  cols = [
    { field: 'skills', header: 'TASK.SKILLS', translatedHeader: '' },
    { field: 'effortMin', header: 'TASK.EFFORT_MIN', translatedHeader: '' },
    { field: 'effortMax', header: 'TASK.EFFORT_MAX', translatedHeader: '' },
    { field: 'rewards', header: 'TASK.REWARDS', translatedHeader: '' },
    { field: 'startDate', header: 'TASK.START_DATE', translatedHeader: '' },
    { field: 'dueDate', header: 'TASK.DUE_DATE', translatedHeader: '' },
    { field: 'isCompleted', header: 'TASK.COMPLETED', translatedHeader: '' },
    { field: 'status', header: 'TASK.STATUS', translatedHeader: '' },
    { field: 'assigneeName', header: 'TASK.ASSIGNED_TO', translatedHeader: '' }
  ];

  selectedColumns = [...this.cols];
  private readonly columnStorageKey = 'cometa.taskList.selectedColumns'

  constructor(
    private taskService: TaskService,
    public permissionService: PermissionService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private translateService: TranslateService
  ) { }

  ngOnInit(): void {
    this.loadTasks();
    this.loadColumnHeaders();

    // Translation for column headers
    this.updateTranslatedHeaders();

    // Subscribe to language changes
    this.translateService.onLangChange.subscribe(() => {
      this.updateTranslatedHeaders();
    });

    const saved = localStorage.getItem(this.columnStorageKey);
    if (saved) {
      const savedFields = JSON.parse(saved);
      this.selectedColumns = this.cols.filter(c => savedFields.includes(c.field));
    } else {
      // Optional: Default-Auswahl
      this.selectedColumns = [...this.cols];
    }
  }

  updateTranslatedHeaders(): void {
    this.cols.forEach(col => {
      col.translatedHeader = this.translateService.instant(col.header);
    });
  }

  onColumnChange(): void {
    const fields = this.selectedColumns.map(c => c.field);
    localStorage.setItem(this.columnStorageKey, JSON.stringify(fields));
  }

  loadTasks(): void {
    this.taskService.getTasks().subscribe({
      next: (tasks) => {
        this.tasks = tasks;
      },
      error: (err) => {
        console.error('Error loading tasks:', err);
      }
    });
  }

  loadColumnHeaders(): void {
    // Initialize column headers with translations
    this.cols.forEach(col => {
      col.translatedHeader = this.translateService.instant(col.header);
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

  statusSeverity(status: string): string {
    switch (status) {
      case 'Done':
        return 'success';
      case 'InProgress':
        return 'info';
      case 'Blocked':
        return 'danger';
      case 'Waiting':
        return 'warning';
      default:
        return 'info';
    }
  }


  protected readonly HTMLInputElement = HTMLInputElement;

}
