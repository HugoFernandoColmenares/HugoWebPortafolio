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
      background: var(--gradient-brand);
      color: var(--color-on-accent);
      box-shadow: var(--shadow-accent);
    }
    .btn--primary:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: var(--shadow-lg);
    }
    .btn--primary:active:not(:disabled) { transform: translateY(0); }

    .btn--secondary {
      background: var(--color-surface-2);
      color: var(--color-text-heading);
      border-color: var(--color-border);
    }
    .btn--secondary:hover:not(:disabled) {
      background: var(--color-border);
      transform: translateY(-1px);
    }

    .btn--outline {
      background: transparent;
      color: var(--color-accent);
      border-color: var(--color-accent);
    }
    .btn--outline:hover:not(:disabled) {
      background: color-mix(in srgb, var(--color-accent) 10%, transparent);
      transform: translateY(-1px);
    }

    .btn--ghost {
      background: transparent;
      color: var(--color-text);
      border-color: transparent;
    }
    .btn--ghost:hover:not(:disabled) {
      background: var(--color-surface-2);
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
