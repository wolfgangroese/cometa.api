import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideRouter } from "@angular/router";
import { routes } from "./app/app.routes";
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { ToastModule } from "primeng/toast";
import { importProvidersFrom } from "@angular/core";
import { MessageService } from "primeng/api";


bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(ToastModule),
    MessageService,
    provideHttpClient(withFetch()),
    provideRouter(routes),
    provideAnimationsAsync(),
  ],
})
  .catch(err => console.error(err));
