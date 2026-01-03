import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {Router, RouterLink} from '@angular/router';
import { AuthService } from '../services/auth.service';
import { LoginDto } from '../models/dtos/login.dto';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms'; // ReactiveFormsModule
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { CardModule } from 'primeng/card';  // Für p-card

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ToastModule,
    ButtonModule,
    InputTextModule,
    PasswordModule,
    CardModule,
    ReactiveFormsModule,
    RouterLink,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [MessageService],
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  async login(): Promise<void> {
    if (this.loginForm.invalid) {
      return;
    }

    const loginData: LoginDto = this.loginForm.value;
    console.log('Attempting login with:', loginData.email);

    this.authService.login(loginData).subscribe({
      next: async (response: unknown) => {
        if (response && typeof response === 'object' && 'token' in response) {
          const typedResponse = response as { token: string };
          this.authService.saveToken(typedResponse.token);
          this.authService.loadUserFromToken();
          await this.router.navigate(['/home']);
        }
      },

      error: (error) => {
        console.error('Login error:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Login failed',
          detail: error?.message || 'Invalid credentials',
          life: 3000,
        });
      },
    });

  }
}
