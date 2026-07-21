import { Component, inject, ChangeDetectionStrategy } from '@angular/core';

import { RouterLink } from '@angular/router';
import { TranslationService } from '../../core/services/translation.service';
import { AppConfigService } from '../../core/services/app-config.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './home.component.css'
})
export class HomeComponent {
  readonly ts = inject(TranslationService);
  readonly config = inject(AppConfigService);
}
