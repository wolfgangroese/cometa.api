import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService, ConfirmationService } from 'primeng/api';
import { Organization, CreateOrganizationDto } from '../../models/organization.model';
import { OrganizationService } from '../../services/organization.service';
import {InputTextareaModule} from "primeng/inputtextarea";

@Component({
  selector: 'app-organizations-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TableModule,
    ButtonModule,
    ToastModule,
    ConfirmDialogModule,
    DialogModule,
    InputTextModule,
    CardModule,
    ReactiveFormsModule,
    InputTextareaModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './organizations-list.component.html',
  styleUrls: ['./organizations-list.component.scss']
})
export class OrganizationsListComponent implements OnInit {
  organizations: Organization[] = [];
  loading = false;
  displayCreateDialog = false;
  createForm: FormGroup;

  constructor(
    private orgService: OrganizationService,
    private router: Router,
    private fb: FormBuilder,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {
    this.createForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
      slug: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.pattern(/^[a-z0-9-]+$/) // Only lowercase letters, numbers, and hyphens
      ]]
    });
  }

  ngOnInit(): void {
    this.loadOrganizations();
  }

  loadOrganizations(): void {
    this.loading = true;
    this.orgService.getOrganizations().subscribe({
      next: (orgs) => {
        this.organizations = orgs;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading organizations:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load organizations'
        });
        this.loading = false;
      }
    });
  }

  openCreateDialog(): void {
    this.createForm.reset();
    this.displayCreateDialog = true;
  }

  createOrganization(): void {
    if (this.createForm.invalid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Validation Error',
        detail: 'Please correct the form errors'
      });
      return;
    }

    const createData: CreateOrganizationDto = this.createForm.value;
    this.loading = true;

    this.orgService.createOrganization(createData).subscribe({
      next: (org) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: `Organization ${org.name} created successfully`
        });
        this.displayCreateDialog = false;
        this.loadOrganizations();
      },
      error: (err) => {
        console.error('Error creating organization:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.error?.message || 'Failed to create organization'
        });
        this.loading = false;
      }
    });
  }

  confirmDelete(org: Organization): void {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete the organization "${org.name}"? This action cannot be undone.`,
      header: 'Confirm Deletion',
      icon: 'pi pi-exclamation-triangle',
      accept: () => this.deleteOrganization(org.id)
    });
  }

  deleteOrganization(id: string): void {
    this.loading = true;
    this.orgService.deleteOrganization(id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Organization deleted successfully'
        });
        this.loadOrganizations();
      },
      error: (err) => {
        console.error('Error deleting organization:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.error?.message || 'Failed to delete organization'
        });
        this.loading = false;
      }
    });
  }

  switchToOrganization(org: Organization): void {
    this.loading = true;
    this.orgService.switchOrganization(org.id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: `Switched to organization "${org.name}"`
        });
        // Redirect to home or refresh the current page
        window.location.reload();
      },
      error: (err) => {
        console.error('Error switching organization:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.error?.message || 'Failed to switch organization'
        });
        this.loading = false;
      }
    });
  }

  navigateToDetail(org: Organization): void {
    this.router.navigate(['/organizations', org.id]);
  }

  // Helper function to auto-generate a slug from the name
  generateSlug(): void {
    const name = this.createForm.get('name')?.value;
    if (name) {
      const slug = name.toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '') // Remove invalid chars
        .replace(/\s+/g, '-') // Replace spaces with -
        .replace(/-+/g, '-'); // Replace multiple - with single -

      this.createForm.get('slug')?.setValue(slug);
    }
  }
}
