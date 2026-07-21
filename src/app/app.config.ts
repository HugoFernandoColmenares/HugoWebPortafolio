import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withHashLocation } from '@angular/router';
import { providePrimeNG } from 'primeng/config';

import { routes } from './app.routes';
import { portfolioPrimePreset } from './core/config/prime-theme.config';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withHashLocation()),
    providePrimeNG({
      theme: {
        preset: portfolioPrimePreset,
        options: {
          darkModeSelector: '[data-theme="dark"]',
          cssLayer: false,
        },
      },
      ripple: true,
    }),
  ],
};
