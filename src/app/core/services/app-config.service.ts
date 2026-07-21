import { Injectable } from '@angular/core';
import { appEnvironment, AppEnvironment } from '../config/app-environment';

@Injectable({ providedIn: 'root' })
export class AppConfigService {
  readonly env: AppEnvironment = appEnvironment;
}
