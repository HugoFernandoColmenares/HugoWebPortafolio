import { Component, inject, ChangeDetectionStrategy } from '@angular/core';

import { TranslationService } from '../../core/services/translation.service';
import { AppConfigService } from '../../core/services/app-config.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [],
  templateUrl: './footer.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  readonly ts = inject(TranslationService);
  readonly config = inject(AppConfigService);
  readonly year = new Date().getFullYear();
}
