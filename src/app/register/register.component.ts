import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';  // Notwendig für Standalone-Komponenten
import { FormsModule} from "@angular/forms";
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { RegisterDto } from '../models/dtos/register.dto'; // Importiere Register DTO

@Component({
  selector: 'app-register',
  standalone: true, // Standalone-Komponente
  imports: [CommonModule, FormsModule], // Notwendige Module importieren
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  register(): void {
    const registerData: RegisterDto = {
      email: this.email,
      password: this.password
    };

    this.authService.register(registerData).subscribe(
      (response: any) => {
        // Weiterleitung nach erfolgreicher Registrierung
        this.router.navigate(['/login']);
      },
      (error) => {
        this.errorMessage = 'Registration failed. Please try again.'; // Fehlermeldung anzeigen
      }
    );
  }
}
