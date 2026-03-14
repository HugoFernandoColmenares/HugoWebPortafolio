import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      [class]="'btn btn--' + variant"
      [disabled]="disabled"
      (click)="clicked.emit()"
    >
      @if (icon && iconPosition === 'left') {
        <span class="btn__icon" [innerHTML]="icon"></span>
      }
      <span>{{ label }}</span>
      @if (icon && iconPosition === 'right') {
        <span class="btn__icon" [innerHTML]="icon"></span>
      }
    </button>
  `,
  styles: [`
    .btn {
      display: inline-flex;
      align-items: center;
      gap: 0.8rem;
      padding: 1.2rem 2.4rem;
      border-radius: var(--radius-md, 1.2rem);
      font-family: var(--font-main, 'Inter', sans-serif);
      font-size: 1.5rem;
      font-weight: 600;
      letter-spacing: 0.01em;
      border: 2px solid transparent;
      cursor: pointer;
      transition: all 0.25s ease;
      white-space: nowrap;
    }
    .btn:disabled { opacity: 0.5; cursor: not-allowed; }

    .btn__icon {
      display: flex;
      align-items: center;
      width: 1.8rem;
      height: 1.8rem;
      flex-shrink: 0;
    }

    .btn--primary {
      background: linear-gradient(135deg, #38bdf8 0%, #818cf8 100%);
      color: #fff;
      box-shadow: 0 4px 15px rgba(56,189,248,0.25);
    }
    .btn--primary:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(56,189,248,0.4);
    }
    .btn--primary:active:not(:disabled) { transform: translateY(0); }

    .btn--secondary {
      background: var(--color-surface-2, #f1f5f9);
      color: var(--color-text-heading, #0f172a);
      border-color: var(--color-border, #e2e8f0);
    }
    .btn--secondary:hover:not(:disabled) {
      background: var(--color-border, #e2e8f0);
      transform: translateY(-1px);
    }

    .btn--outline {
      background: transparent;
      color: var(--color-accent, #38bdf8);
      border-color: var(--color-accent, #38bdf8);
    }
    .btn--outline:hover:not(:disabled) {
      background: color-mix(in srgb, var(--color-accent, #38bdf8) 10%, transparent);
      transform: translateY(-1px);
    }

    .btn--ghost {
      background: transparent;
      color: var(--color-text, #334155);
      border-color: transparent;
    }
    .btn--ghost:hover:not(:disabled) {
      background: var(--color-surface-2, #f1f5f9);
    }
  `]
})
export class ButtonComponent {
  @Input({ required: true }) label!: string;
  @Input() variant: ButtonVariant = 'primary';
  @Input() icon?: string;
  @Input() iconPosition: 'left' | 'right' = 'right';
  @Input() disabled = false;
  @Output() clicked = new EventEmitter<void>();
}
