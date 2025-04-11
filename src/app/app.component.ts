import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from "./shell/header/header.component";
import { FooterComponent } from "./shell/footer/footer.component";
import { FormsModule } from "@angular/forms";
import { ToastModule } from "primeng/toast";
import { MessageService } from "primeng/api";
import { AuthService } from "./services/auth.service";
import { TranslateService } from "@ngx-translate/core";
import { TranslateModule } from '@ngx-translate/core';

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
    TranslateModule // Add this to use translate pipe in templates
  ]
})
export class AppComponent implements OnInit {
  title = 'cometa';

  constructor(
    private messageService: MessageService,
    private authService: AuthService,  // Remove extra curly brace
    private translate: TranslateService
  ) {
    // Set available languages
    this.translate.addLangs(['en', 'de']);

    // Set default language
    this.translate.setDefaultLang('en');

    // Try to use browser language if available, otherwise use default
    const browserLang = this.translate.getBrowserLang();
    this.translate.use(browserLang?.match(/en|de/) ? browserLang : 'en');
  }

  ngOnInit(): void {
    this.authService.loadUserFromToken();
  }

  // Add method to switch languages
  switchLanguage(lang: string) {
    this.translate.use(lang);
  }

  showTestToast(): void {
    this.messageService.add({
      severity: 'success',
      summary: 'Test',
      detail: 'Das ist eine Testnachricht.',
      life: 3000
    });
  }

  testAuthDirectly(): void {
    this.authService.testDirectAuth().subscribe({
      next: (result) => console.log('Direct auth test successful:', result),
      error: (err) => console.error('Direct auth test failed:', err)
    });
  }
}
