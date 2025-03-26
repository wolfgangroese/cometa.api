import { Component, OnInit } from '@angular/core';
import { CommonModule } from "@angular/common";
import { Task } from "../../models/task.model";
import { User } from "../../models/user.model";
import { TaskService } from "../../services/task.service";
import { UserService } from "../../services/user.service";
import { RouterLink } from "@angular/router";
import { AccordionModule } from 'primeng/accordion';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, AccordionModule, CardModule, TableModule, ToastModule],
  providers: [MessageService],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  tasks: Task[] = [];
  openTasks: Task[] = [];
  taskCount = 0;
  users: User[] = [];
  expanded = false;

  constructor(
    private taskService: TaskService,
    private userService: UserService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadTasks();
    this.loadUsers();
  }

  loadTasks(): void {
    this.taskService.getTasks().subscribe({
      next: (data) => {
        this.tasks = data;
        this.openTasks = this.tasks.filter(task => !task.isCompleted);
        this.taskCount = this.openTasks.length;
      },
      error: (err) => {
        console.error('Failed to load tasks', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load tasks'
        });
      }
    });
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe({
      next: (users) => {
        // Add total rewards (assuming it might be missing in some users)
        this.users = users.map(user => ({
          ...user,
          totalRewards: user.totalRewards || 0
        }));

        // Sort users by rewards in descending order
        this.users.sort((a, b) => (b.totalRewards || 0) - (a.totalRewards || 0));
      },
      error: (err) => {
        console.error('Failed to load users', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load user leaderboard'
        });
      }
    });
  }

  toggleTasksList(): void {
    this.expanded = !this.expanded;
  }
}
