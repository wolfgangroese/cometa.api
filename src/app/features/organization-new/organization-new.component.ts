import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { OrganizationService } from '../../services/organization.service';
import { MessageService } from 'primeng/api';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import {CreateOrganizationDto} from "../../models/organization.model";

@Component({
  selector: 'app-organization-new',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardModule,
    InputTextModule,
    InputTextareaModule,
    ButtonModule,
    ToastModule
  ],
  templateUrl: './organization-new.component.html',
  styleUrls: ['./organization-new.component.scss'],
  providers: [MessageService]
})
export class OrganizationNewComponent implements OnInit {
  orgForm!: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private orgService: OrganizationService,
    private router: Router,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.orgForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      description: ['', Validators.maxLength(500)],
      slug: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50),
        Validators.pattern(/^[a-z0-9-]+$/)
      ]]
    });
  }

  onSubmit(): void {
    if (this.orgForm.invalid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Form Error',
        detail: 'Please correct the form errors before submitting.'
      });
      return;
    }

    this.loading = true;
    const orgData: CreateOrganizationDto = this.orgForm.value;

    this.orgService.createOrganization(orgData).subscribe({
      next: (org) => {
        this.loading = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: `Organization "${org.name}" created successfully!`
        });
        // Switch to new organization automatically
        this.orgService.switchOrganization(org.id).subscribe({
          next: () => {
            this.router.navigate(['/home']);
          },
          error: (err) => {
            console.error('Error switching to new organization:', err);
            this.router.navigate(['/organizations']);
          }
        });
      },
      error: (err) => {
        this.loading = false;
        console.error('Error creating organization:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.error?.message || 'Failed to create organization'
        });
      }
    });
  }

  generateSlug(): void {
    const name = this.orgForm.get('name')?.value;
    if (name) {
      const slug = name.toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '') // Remove special chars
        .replace(/\s+/g, '-')         // Replace spaces with -
        .replace(/-+/g, '-');         // Replace multiple - with single -

      this.orgForm.get('slug')?.setValue(slug);
    }
  }

  cancel(): void {
    this.router.navigate(['/organizations']);
  }
}
