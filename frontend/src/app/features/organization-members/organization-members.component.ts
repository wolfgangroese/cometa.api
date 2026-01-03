import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageService, ConfirmationService } from 'primeng/api';
import { OrganizationService } from '../../services/organization.service';
import { UserService } from '../../services/user.service';
import { OrganizationRoleEnum, InviteMemberDto, UpdateMemberRoleDto } from '../../models/organization.model';
import { User } from '../../models/user.model';
import {TooltipModule} from "primeng/tooltip";

interface Member extends User {
  role: string;
}

@Component({
  selector: 'app-organization-members',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    DropdownModule,
    DialogModule,
    ToastModule,
    ConfirmDialogModule,
    TooltipModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './organization-members.component.html',
  styleUrls: ['./organization-members.component.scss']
})
export class OrganizationMembersComponent implements OnInit {
  @Input() organizationId = '';
  @Input() userRole = '';
  @Input() isOwner = false;

  members: Member[] = [];
  loading = false;
  inviteDialogVisible = false;
  inviteForm: FormGroup;

  roleOptions = [
    { label: 'Member', value: OrganizationRoleEnum.Member },
    { label: 'Admin', value: OrganizationRoleEnum.Admin }
  ];

  constructor(
    private orgService: OrganizationService,
    private userService: UserService,
    private fb: FormBuilder,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {
    this.inviteForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      role: [OrganizationRoleEnum.Member, Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadMembers();
  }

  loadMembers(): void {
    this.loading = true;
    // Assuming the UserService has a method to get members of an organization
    this.userService.getOrganizationMembers(this.organizationId).subscribe({
      next: (users) => {
        this.members = users as Member[];
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading members:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load organization members'
        });
        this.loading = false;
      }
    });
  }

  showInviteDialog(): void {
    this.inviteForm.reset({
      email: '',
      role: OrganizationRoleEnum.Member
    });
    this.inviteDialogVisible = true;
  }

  inviteMember(): void {
    if (this.inviteForm.invalid) {
      return;
    }

    const inviteData: InviteMemberDto = this.inviteForm.value;
    this.loading = true;

    this.orgService.inviteMember(this.organizationId, inviteData).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: `Invitation sent to ${inviteData.email}`
        });
        this.inviteDialogVisible = false;
        this.loadMembers(); // Reload the members list
      },
      error: (err) => {
        console.error('Error inviting member:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.error?.message || 'Failed to send invitation'
        });
        this.loading = false;
      }
    });
  }

  confirmRemoveMember(member: Member): void {
    // Don't allow removing yourself if you're the owner
    if (member.role === 'Owner' && !this.isOwner) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Only the owner can remove themselves from the organization'
      });
      return;
    }

    this.confirmationService.confirm({
      message: `Are you sure you want to remove ${member.fullName || member.userName || member.email} from this organization?`,
      header: 'Confirm Removal',
      icon: 'pi pi-exclamation-triangle',
      accept: () => this.removeMember(member.id)
    });
  }

  removeMember(userId: string): void {
    this.loading = true;
    this.orgService.removeMember(this.organizationId, userId).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Member removed successfully'
        });
        this.loadMembers(); // Reload the members list
      },
      error: (err) => {
        console.error('Error removing member:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.error?.message || 'Failed to remove member'
        });
        this.loading = false;
      }
    });
  }

  updateRole(member: Member, newRole: OrganizationRoleEnum): void {
    // Don't allow changing the role of the owner
    if (member.role === 'Owner') {
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Cannot change the role of the organization owner'
      });
      return;
    }

    const updateData: UpdateMemberRoleDto = {
      role: newRole
    };

    this.loading = true;
    this.orgService.updateMemberRole(this.organizationId, member.id, updateData).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: `Role updated to ${newRole}`
        });
        this.loadMembers(); // Reload the members list
      },
      error: (err) => {
        console.error('Error updating role:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.error?.message || 'Failed to update role'
        });
        this.loading = false;
      }
    });
  }

  // Helper methods
  canManageMembers(): boolean {
    return this.isOwner || this.userRole === 'Admin';
  }

  canManageRoles(): boolean {
    return this.isOwner;
  }
}
