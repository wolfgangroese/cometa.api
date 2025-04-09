// src/app/features/skills/skills-management/skills-management.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { TooltipModule } from 'primeng/tooltip';
import { MessageService, ConfirmationService } from 'primeng/api';
import { SkillService } from '../../services/skill.service';
import { Skill } from '../../models/skill.model';

@Component({
  selector: 'app-skills-management',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    ToastModule,
    ConfirmDialogModule,
    DialogModule,
    TooltipModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './skills-management.component.html',
  styleUrls: ['./skills-management.component.scss']
})
export class SkillsManagementComponent implements OnInit {
  skills: Skill[] = [];
  skillForm: FormGroup;
  editingSkill: Skill | null = null;
  loading = false;

  // Properties for tasks dialog
  tasksUsingSkill: any[] = [];
  showTasksDialog = false;
  selectedSkill: Skill | null = null;

  constructor(
    private skillService: SkillService,
    private fb: FormBuilder,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router
  ) {
    this.skillForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      description: ['']
    });
  }

  ngOnInit(): void {
    this.loadSkills();
  }

  loadSkills(): void {
    this.loading = true;
    this.skillService.getSkills().subscribe({
      next: (skills) => {
        this.skills = skills;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading skills:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load skills'
        });
        this.loading = false;
      }
    });
  }

  addSkill(): void {
    if (this.skillForm.invalid) {
      return;
    }

    const skillData = this.skillForm.value;

    this.loading = true;
    this.skillService.createSkill(skillData).subscribe({
      next: () => {
        this.loadSkills();
        this.skillForm.reset();
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Skill added successfully'
        });
        this.loading = false;
      },
      error: (err) => {
        console.error('Error adding skill:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to add skill'
        });
        this.loading = false;
      }
    });
  }

  editSkill(skill: Skill): void {
    this.editingSkill = skill;
    this.skillForm.patchValue({
      name: skill.name,
      description: skill.description
    });
  }

  updateSkill(): void {
    if (this.skillForm.invalid || !this.editingSkill) {
      return;
    }

    const skillData = {
      ...this.editingSkill,
      ...this.skillForm.value
    };

    this.loading = true;
    this.skillService.updateSkill(this.editingSkill.id, skillData).subscribe({
      next: () => {
        const index = this.skills.findIndex(s => s.id === this.editingSkill!.id);
        if (index !== -1) {
          this.skills[index] = skillData;
        }
        this.cancelEdit();
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Skill updated successfully'
        });
        this.loading = false;
      },
      error: (err) => {
        console.error('Error updating skill:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to update skill'
        });
        this.loading = false;
      }
    });
  }

  confirmDelete(skill: Skill): void {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete the skill "${skill.name}"?`,
      accept: () => {
        this.deleteSkill(skill);
      }
    });
  }

  deleteSkill(skill: Skill): void {
    this.loading = true;
    this.skillService.deleteSkill(skill.id).subscribe({
      next: () => {
        this.skills = this.skills.filter(s => s.id !== skill.id);
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Skill deleted successfully'
        });
        this.loading = false;
      },
      error: (err) => {
        console.error('Error deleting skill:', err);
        this.loading = false;

        // Check if it's the "skill in use" error
        if (err.status === 400 &&
          (err.error?.includes?.('associated with') ||
            err.error?.message?.includes?.('associated with') ||
            err.error?.includes?.('in use') ||
            err.message?.includes?.('associated with') ||
            JSON.stringify(err).includes('associated with'))) {

          // Show warning toast
          this.messageService.add({
            severity: 'warn',
            summary: 'Skill in Use',
            detail: 'This skill cannot be deleted because it is being used in one or more tasks.'
          });

          // Directly load the tasks for this skill
          this.showTasksUsingSkill(skill.id);
        } else {
          // Generic error
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to delete skill: ' + (err.error?.message || err.message || 'Unknown error')
          });
        }
      }
    });
  }

  // Method to show tasks using a skill
  showTasksUsingSkill(skillId: string): void {
    // Find the skill for display
    this.selectedSkill = this.skills.find(s => s.id === skillId) || null;

    this.loading = true;
    this.skillService.getTasksUsingSkill(skillId).subscribe({
      next: (tasks) => {
        console.log('Tasks using this skill:', tasks);
        this.tasksUsingSkill = tasks;

        if (tasks.length === 0) {
          this.messageService.add({
            severity: 'info',
            summary: 'No Tasks Found',
            detail: 'No tasks are currently using this skill.'
          });
        } else {
          // Open dialog to show tasks
          this.showTasksDialog = true;
          console.log('Dialog should be shown now:', this.showTasksDialog);
        }

        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching tasks using skill:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load tasks using this skill.'
        });
        this.loading = false;
      }
    });
  }

  // Navigate to task detail
  async navigateToTask(taskId: string): Promise<void> {
    this.showTasksDialog = false; // Close dialog
  await this.router.navigate(['/task', taskId]);
  }

  cancelEdit(): void {
    this.editingSkill = null;
    this.skillForm.reset();
  }

  get isEditing(): boolean {
    return this.editingSkill !== null;
  }
}
