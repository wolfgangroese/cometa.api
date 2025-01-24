import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from "./shell/header/header.component";
import {FooterComponent} from "./shell/footer/footer.component";
import {FormsModule} from "@angular/forms";
import {ToastModule} from "primeng/toast";
import {MessageService} from "primeng/api";

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
export class AppComponent {
  title = 'cometa';

  constructor(private messageService: MessageService) {}
  showTestToast(): void {
    this.messageService.add({
      severity: 'success',
      summary: 'Test',
      detail: 'Das ist eine Testnachricht.',
      life: 3000
    });
  }
}

