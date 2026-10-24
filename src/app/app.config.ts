import { IMAGE_LOADER, ImageLoaderConfig } from '@angular/common';
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, TitleStrategy, withHashLocation, withInMemoryScrolling } from '@angular/router';

import { routes } from './app.routes';
import { I18nTitleStrategy } from './core/services/i18n-title.strategy';

/**
 * Local images under /img/ are pre-generated as `<base>-<width>.webp`
 * (see scripts/optimize-images.mjs). Anything else is passed through.
 */
export function localImageLoader(config: ImageLoaderConfig): string {
  if (config.src.startsWith('/img/')) {
    return `${config.src}-${config.width ?? 800}.webp`;
  }
  return config.src;
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(
      routes,
      withHashLocation(),
      withInMemoryScrolling({ scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled' }),
    ),
    { provide: TitleStrategy, useClass: I18nTitleStrategy },
    { provide: IMAGE_LOADER, useValue: localImageLoader },
  ],
};
