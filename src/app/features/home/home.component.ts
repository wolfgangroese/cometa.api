import { Component, OnInit } from '@angular/core';
import { CommonModule } from "@angular/common";
import { Task, TaskStatus } from "../../models/task.model";
import { User } from "../../models/user.model";
import { TaskService } from "../../services/task.service";
import { UserService } from "../../services/user.service";
import { RouterLink } from "@angular/router";
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ChartModule } from 'primeng/chart';

interface SkillCount {
  skill: string;
  count: number;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    CardModule,
    TableModule,
    ToastModule,
    ChartModule
  ],
  providers: [MessageService],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  tasks: Task[] = [];
  openTasks: Task[] = [];
  users: User[] = [];
  availableSkills: string[] = [];
  activeFilters: string[] = [];
  filteredTasks: Task[] = [];
  showFilters = false;


  // Chart Data
  completionChartData: any;
  statusChartData: any;
  skillsChartData: any;

  // Chart Options
  completionChartOptions: any;
  statusChartOptions: any;
  skillsChartOptions: any;

  constructor(
    private taskService: TaskService,
    private userService: UserService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.initializeChartOptions();
    this.loadTasks();
    this.loadUsers();
  }

  initializeChartOptions(): void {
    // Common chart options
    const baseOptions = {
      plugins: {
        legend: {
          position: 'right',
          align: 'center',
          labels: {
            usePointStyle: true,
            font: {
              size: 12
            },
            padding: 10
          }
        },
        tooltip: {
          mode: 'index',
          intersect: true
        }
      },
      responsive: false, // Disable responsiveness to force fixed size
      maintainAspectRatio: false,
      aspectRatio: 1,
      cutout: '66%'
    };

    this.completionChartOptions = { ...baseOptions };
    this.statusChartOptions = { ...baseOptions };
    this.skillsChartOptions = { ...baseOptions };
  }

  loadTasks(): void {
    this.taskService.getTasks().subscribe({
      next: (data) => {
        this.tasks = data;
        this.openTasks = this.tasks.filter(task => !task.isCompleted);
        this.filteredTasks = [...this.openTasks];

        // Extract and process skills data
        this.availableSkills = Array.from(new Set(
          this.tasks.flatMap(task => task.skills || [])
        )).filter(skill => skill); // Remove empty skills

        // Update chart data
        this.updateCompletionChart();
        this.updateStatusChart();
        this.updateSkillsChart();
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

  updateCompletionChart(): void {
    const completedCount = this.tasks.filter(task => task.isCompleted).length;
    const notCompletedCount = this.tasks.length - completedCount;

    this.completionChartData = {
      labels: ['Completed', 'Not Completed'],
      datasets: [
        {
          data: [completedCount, notCompletedCount],
          backgroundColor: ['#36A2EB', '#FF6384'],
          hoverBackgroundColor: ['#36A2EB', '#FF6384'],
          borderWidth: 0 // Remove borders for cleaner look
        }
      ]
    };
  }

  updateStatusChart(): void {
    // Count tasks by status
    const statusCounts = {
      [TaskStatus.Done]: 0,
      [TaskStatus.InProgress]: 0,
      [TaskStatus.Blocked]: 0,
      [TaskStatus.Waiting]: 0
    };

    this.tasks.forEach(task => {
      if (task.status !== undefined) {
        statusCounts[task.status]++;
      }
    });

    this.statusChartData = {
      labels: ['Done', 'In Progress', 'Blocked', 'Waiting'],
      datasets: [
        {
          data: [
            statusCounts[TaskStatus.Done],
            statusCounts[TaskStatus.InProgress],
            statusCounts[TaskStatus.Blocked],
            statusCounts[TaskStatus.Waiting]
          ],
          backgroundColor: ['#66BB6A', '#42A5F5', '#FFA726', '#EC407A'],
          hoverBackgroundColor: ['#81C784', '#64B5F6', '#FFB74D', '#F06292'],
          borderWidth: 0 // Remove borders for cleaner look
        }
      ]
    };
  }

  updateSkillsChart(): void {
    // Count occurrences of each skill
    const skillCounts = new Map<string, number>();

    this.tasks.forEach(task => {
      if (task.skills) {
        task.skills.forEach(skill => {
          if (skill) {
            skillCounts.set(skill, (skillCounts.get(skill) || 0) + 1);
          }
        });
      }
    });

    // Convert to array and sort by count descending
    const sortedSkills: SkillCount[] = Array.from(skillCounts.entries())
      .map(([skill, count]) => ({ skill, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5); // Take top 5

    this.skillsChartData = {
      labels: sortedSkills.map(s => s.skill),
      datasets: [
        {
          data: sortedSkills.map(s => s.count),
          backgroundColor: ['#26C6DA', '#AB47BC', '#26A69A', '#5C6BC0', '#EF5350'],
          hoverBackgroundColor: ['#4DD0E1', '#BA68C8', '#4DB6AC', '#7986CB', '#EF5350'],
          borderWidth: 0 // Remove borders for cleaner look
        }
      ]
    };
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

  toggleSkillFilter(skill: string): void {
    const index = this.activeFilters.indexOf(skill);
    if (index > -1) {
      // Remove from filters
      this.activeFilters.splice(index, 1);
    } else {
      // Add to filters
      this.activeFilters.push(skill);
    }
    this.applyFilters();
  }

  applyFilters(): void {
    if (this.activeFilters.length === 0) {
      // No filters, show all open tasks
      this.filteredTasks = [...this.openTasks];
    } else {
      // Show only tasks that have ALL selected skills
      this.filteredTasks = this.openTasks.filter(task =>
        this.activeFilters.every(skill =>
          task.skills && task.skills.includes(skill)
        )
      );
    }
  }

  resetFilters(): void {
    this.activeFilters = [];
    this.filteredTasks = [...this.openTasks];
  }
}
