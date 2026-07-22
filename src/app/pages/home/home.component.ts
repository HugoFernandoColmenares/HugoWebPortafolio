import { Component, inject, ChangeDetectionStrategy } from '@angular/core';

import { RouterLink } from '@angular/router';
import { TranslationService } from '../../core/services/translation.service';
import { AppConfigService } from '../../core/services/app-config.service';

interface HeroChip {
  label: string;
  variant: 'angular' | 'dotnet' | 'typescript' | 'sql';
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './home.component.css'
})
export class HomeComponent {
  readonly ts = inject(TranslationService);
  readonly config = inject(AppConfigService);

  readonly heroChips: HeroChip[] = [
    { label: 'Angular', variant: 'angular' },
    { label: '.NET Core', variant: 'dotnet' },
    { label: 'TypeScript', variant: 'typescript' },
    { label: 'SQL Server', variant: 'sql' },
  ];
}
