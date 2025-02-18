import { Component, OnInit } from '@angular/core';
import { CommonModule } from "@angular/common";
import { Task } from "../../models/task.model";
import { TaskService } from "../../services/task.service";
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  tasks: Task[] = [];
  taskCount = 0;

  constructor(private taskService: TaskService) { }

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.taskService.getTasks().subscribe({
      next: (data) => {
        this.tasks = data;
        this.updateTaskCount();
      },
      error: (err) => {
        console.error('Failed to load tasks', err);
        this.tasks = [];
        this.taskCount = 0; // Keine Tasks vorhanden
      }
    });
  }

  private updateTaskCount(): void {
    this.taskCount = this.tasks.filter(task => !task.isCompleted).length;
  }
}
