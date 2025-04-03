// src/app/features/user-management/user-management.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    DropdownModule,
    ButtonModule,
    ToastModule,
    FormsModule
  ],
  providers: [MessageService],
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss']
})
export class UserManagementComponent implements OnInit {
  users: User[] = [];
  loading = false;
  roles = [
    { name: 'Admin', value: 'Admin' },
    { name: 'Staff', value: 'Staff' },
    { name: 'Performer', value: 'Performer' }
  ];

  constructor(
    private userService: UserService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading users:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load users'
        });
        this.loading = false;
      }
    });
  }

  updateUserRole(user: User, role: string): void {
    this.loading = true;
    this.userService.updateUserRole(user.id, role).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: `${user.userName}'s role updated to ${role}`
        });
        // Update local role
        user.role = role;
        if (user.roles) {
          user.roles = [role]; // Update roles array too
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error updating role:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to update user role'
        });
        this.loading = false;
      }
    });
  }
}
