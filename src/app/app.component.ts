import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from "./shell/header/header.component";
import { FooterComponent } from "./shell/footer/footer.component";
import { FormsModule } from "@angular/forms";
import { ToastModule } from "primeng/toast";
import { MessageService } from "primeng/api";
import { AuthService } from "./services/auth.service"; // ✅ AuthService importieren

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  providers: [MessageService],
  styleUrls: ['./app.component.scss'],
  imports: [
    CommonModule,
    RouterModule,
    HeaderComponent,
    FooterComponent,
    FormsModule,
    ToastModule,
  ]
})
export class AppComponent implements OnInit { // ✅ OnInit implementieren
  title = 'cometa';

  constructor(private messageService: MessageService, private authService: AuthService) {} // ✅ AuthService injizieren

  ngOnInit(): void {
    this.authService.loadUserFromToken(); // ✅ Benutzer nach Seiten-Reload wiederherstellen
  }

  showTestToast(): void {
    this.messageService.add({
      severity: 'success',
      summary: 'Test',
      detail: 'Das ist eine Testnachricht.',
      life: 3000
    });
  }
}
