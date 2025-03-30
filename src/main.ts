import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';

import { AppComponent } from './app/app.component';
import { appConfig } from "./app/app.config";

// Erweitere die appConfig mit provideAnimations
const configWithAnimations = {
  ...appConfig,
  providers: [
    ...appConfig.providers || [],
    provideAnimations()
  ]
};

bootstrapApplication(AppComponent, configWithAnimations)
  .catch(err => console.error(err));
