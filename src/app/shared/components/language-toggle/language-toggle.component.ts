import { Component, inject, ChangeDetectionStrategy } from '@angular/core';

import { TranslationService } from '../../../core/services/translation.service';

@Component({
  selector: 'app-language-toggle',
  standalone: true,
  imports: [],
  template: `
    <button
      class="lang-toggle"
      [attr.aria-label]="'Switch language to ' + (ts.currentLang() === 'en' ? 'Español' : 'English')"
      (click)="ts.toggleLanguage()"
    >
      <span [class.lang-active]="ts.currentLang() === 'en'">EN</span>
      <span class="lang-divider">|</span>
      <span [class.lang-active]="ts.currentLang() === 'es'">ES</span>
    </button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [`
    .lang-toggle {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      background: var(--color-surface-2);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-full);
      padding: 0.6rem 1.2rem;
      font-family: var(--font-main);
      font-size: 1.3rem;
      font-weight: var(--font-weight-semibold);
      color: var(--color-text-muted);
      cursor: pointer;
      transition: border-color var(--transition-fast), color var(--transition-fast);
      letter-spacing: 0.05em;
      min-height: 4.4rem;
    }
    .lang-toggle:hover {
      border-color: var(--color-accent);
      color: var(--color-accent);
    }
    .lang-divider { opacity: 0.3; }
    .lang-active { color: var(--color-accent); }
  `]
})
export class LanguageToggleComponent {
  readonly ts = inject(TranslationService);
}
