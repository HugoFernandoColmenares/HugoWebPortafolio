import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslationService } from '../../../core/services/translation.service';

@Component({
  selector: 'app-language-toggle',
  standalone: true,
  imports: [CommonModule],
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
  styles: [`
    .lang-toggle {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      background: var(--color-surface-2, #f1f5f9);
      border: 1px solid var(--color-border, #e2e8f0);
      border-radius: 9999px;
      padding: 0.6rem 1.2rem;
      font-family: var(--font-main, 'Inter', sans-serif);
      font-size: 1.3rem;
      font-weight: 600;
      color: var(--color-text-muted, #64748b);
      cursor: pointer;
      transition: all 0.15s ease;
      letter-spacing: 0.05em;
    }
    .lang-toggle:hover {
      border-color: var(--color-accent, #38bdf8);
      color: var(--color-accent, #38bdf8);
    }
    .lang-divider { opacity: 0.3; }
    .lang-active { color: var(--color-accent, #38bdf8); }
  `]
})
export class LanguageToggleComponent {
  readonly ts = inject(TranslationService);
}
