import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { TranslationService } from '../../../core/services/translation.service';

@Component({
  selector: 'app-language-toggle',
  standalone: true,
  template: `
    <button type="button" class="lang-toggle" (click)="ts.toggleLanguage()">
      <span [class.lang-active]="ts.currentLang() === 'en'" [attr.lang]="'en'">EN</span>
      <span class="lang-divider" aria-hidden="true">/</span>
      <span [class.lang-active]="ts.currentLang() === 'es'" [attr.lang]="'es'">ES</span>
      <span class="sr-only">{{ hint() }}</span>
    </button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [`
    .lang-toggle {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      background: transparent;
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      padding: 0 1.2rem;
      font-family: var(--font-mono);
      font-size: 1.3rem;
      font-weight: 500;
      color: var(--color-text-muted);
      cursor: pointer;
      min-height: 4.4rem;
      transition: border-color var(--transition-fast), background-color var(--transition-fast);
    }
    .lang-toggle:hover { border-color: var(--color-border-strong); background: var(--color-surface-2); }
    .lang-divider { color: var(--color-text-muted); }
    .lang-active { color: var(--color-text-heading); font-weight: 700; text-decoration: underline; text-decoration-color: var(--color-accent); text-decoration-thickness: 0.2rem; text-underline-offset: 0.4rem; }
  `],
})
export class LanguageToggleComponent {
  readonly ts = inject(TranslationService);
  readonly hint = computed(() =>
    this.ts.currentLang() === 'en' ? '— switch to Español' : '— cambiar a English',
  );
}
