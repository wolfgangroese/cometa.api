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
    private authService: AuthService,  // Remove extra curly brace
    private translate: TranslateService
  ) {
    // Set available languages
    this.translate.addLangs(['en', 'de']);

    // Set default language
    this.translate.setDefaultLang('en');

    // Try to use language from localStorage first
    const savedLang = localStorage.getItem('preferredLanguage');
    if (savedLang && this.translate.getLangs().includes(savedLang)) {
      this.translate.use(savedLang);
    } else {
      // Fall back to browser language
      const browserLang = this.translate.getBrowserLang();
      this.translate.use(browserLang?.match(/en|de/) ? browserLang : 'en');
    }
  }

  ngOnInit(): void {
    this.authService.loadUserFromToken();
    const savedLang = localStorage.getItem('lang');
    if (savedLang) {
      this.translate.use(savedLang);
    }
  }


  testAuthDirectly(): void {
    this.authService.testDirectAuth().subscribe({
      next: (result) => console.log('Direct auth test successful:', result),
      error: (err) => console.error('Direct auth test failed:', err)
    });
  }
}
