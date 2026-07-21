import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { NotificationService } from './app/core/services/notification.service';

bootstrapApplication(AppComponent, appConfig).catch((err) => {
  const message = err instanceof Error ? err.message : 'Application failed to start.';
  NotificationService.showFatalError(message);
});
