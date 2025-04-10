import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TabViewModule } from 'primeng/tabview';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { Organization, UpdateOrganizationDto } from '../../models/organization.model';
import { OrganizationService } from '../../services/organization.service';
import {OrganizationMembersComponent} from "../organization-members/organization-members.component";

@Component({
  selector: 'app-organization-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    CardModule,
    ButtonModule,
    InputTextModule,
    InputTextareaModule,
    TabViewModule,
    ToastModule,
    OrganizationMembersComponent
  ],
  providers: [MessageService],
  templateUrl: './organization-detail.component.html',
  styleUrls: ['./organization-detail.component.scss']
})
export class OrganizationDetailComponent implements OnInit {
  organization: Organization | null = null;
  organizationId = '';
  loading = false;
  editForm: FormGroup;
  activeTabIndex = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private orgService: OrganizationService,
    private messageService: MessageService
  ) {
    this.editForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
      slug: [{ value: '', disabled: true }] // Slug can't be changed after creation
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.organizationId = id;
        this.loadOrganization();
      } else {
        this.router.navigate(['/organizations']);
      }
    });
  }

  loadOrganization(): void {
    this.loading = true;
    this.orgService.getOrganization(this.organizationId).subscribe({
      next: (org) => {
        this.organization = org;
        this.editForm.patchValue({
          name: org.name,
          description: org.description || '',
          slug: org.slug
        });
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading organization:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load organization details'
        });
        this.loading = false;
        this.router.navigate(['/organizations']);
      }
    });
  }

  updateOrganization(): void {
    if (!this.organization || this.editForm.invalid) {
      return;
    }

    const updateData: UpdateOrganizationDto = {
      name: this.editForm.get('name')?.value,
      description: this.editForm.get('description')?.value,
      slug: this.organization.slug // Keep the original slug
    };

    this.loading = true;
    this.orgService.updateOrganization(this.organizationId, updateData).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Organization updated successfully'
        });
        this.loadOrganization(); // Reload to get the updated data
      },
      error: (err) => {
        console.error('Error updating organization:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.error?.message || 'Failed to update organization'
        });
        this.loading = false;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/organizations']);
  }

  switchToOrganization(): void {
    if (!this.organization) {
      return;
    }

    this.loading = true;
    this.orgService.switchOrganization(this.organizationId).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: `Switched to organization "${this.organization?.name}"`
        });
        // Redirect to home page
        this.router.navigate(['/home']);
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

  // Check if current user is owner or admin
  canEdit(): boolean {
    return this.organization?.isOwner || this.organization?.role === 'Admin';
  }
}
