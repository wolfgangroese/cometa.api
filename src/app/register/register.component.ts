import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidatorFn, AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from '../services/auth.service';
import { CardModule } from 'primeng/card';
import { NgIf } from '@angular/common';
import { ToastModule } from 'primeng/toast';

/** Custom Validator für Passwort-Abgleich */
const passwordMatchValidator: ValidatorFn = (form: AbstractControl) => {
  const pass = form.get('password')?.value;
  const confirm = form.get('confirmPassword')?.value;
  return pass === confirm ? null : { mismatch: true };
};

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CardModule,
    ReactiveFormsModule,
    NgIf,
    ToastModule,
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  providers: [MessageService]
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
    }, { validators: passwordMatchValidator });

    // ✅ Ensure Angular checks inputs
    setTimeout(() => {
      this.registerForm.updateValueAndValidity();
    }, 50);
  }



  get email() {
    return this.registerForm.get('email');
  }
  get password() {
    return this.registerForm.get('password');
  }
  get confirmPassword() {
    return this.registerForm.get('confirmPassword');
  }

  register(): void {
    if (this.registerForm.invalid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Formular ungültig',
        detail: 'Bitte überprüfen Sie Ihre Eingaben.'
      });
      return;
    }

    const registerData = { ...this.registerForm.value };
    delete registerData.confirmPassword; // Backend braucht das nicht

    this.authService.register(registerData).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Registrierung erfolgreich',
          detail: 'Sie können sich jetzt anmelden.'
        });
        this.router.navigate(['/login']);
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Registrierung fehlgeschlagen',
          detail: error?.message || 'Ein Fehler ist aufgetreten.'
        });
      }
    });
  }
}
