import { Component, Output, EventEmitter, inject, ChangeDetectionStrategy } from '@angular/core';

import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslationService } from '../../core/services/translation.service';
import { ThemeService } from '../../core/services/theme.service';
import { LanguageToggleComponent } from '../components/language-toggle/language-toggle.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, LanguageToggleComponent],
  templateUrl: './header.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  @Output() toggleSidebar = new EventEmitter<void>();

  readonly ts = inject(TranslationService);
  readonly themeService = inject(ThemeService);

  get isDark(): boolean {
    return this.themeService.currentTheme() === 'dark';
  }
}
