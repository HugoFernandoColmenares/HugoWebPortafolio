import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

const TECH_COLORS: Record<string, string> = {
  'Angular': '#dd0031',
  '.NET Core': '#512bd4',
  'C#': '#9b4f9b',
  'TypeScript': '#3178c6',
  'JavaScript': '#f7df1e',
  'SQL Server': '#cc2927',
  'PostgreSQL': '#336791',
  'Docker': '#2496ed',
  'Git': '#f05032',
  'HTML': '#e34f26',
  'CSS': '#1572b6',
  'Node.js': '#339933',
  'Python': '#3776ab',
  'Azure': '#0078d4',
  'RxJS': '#b7178c',
  'Entity Framework': '#512bd4',
  'WPF': '#5c2d91',
  'DDD': '#38bdf8',
};

@Component({
  selector: 'app-tech-badge',
  standalone: true,
  imports: [CommonModule],
  template: `<span class="tech-badge" [style.--badge-color]="color">{{ tech }}</span>`,
  styles: [`
    .tech-badge {
      display: inline-flex;
      align-items: center;
      padding: 0.4rem 1rem;
      border-radius: 9999px;
      font-size: 1.2rem;
      font-weight: 600;
      letter-spacing: 0.03em;
      background: color-mix(in srgb, var(--badge-color, #38bdf8) 12%, var(--color-surface));
      color: var(--badge-color, #38bdf8);
      border: 1px solid color-mix(in srgb, var(--badge-color, #38bdf8) 30%, transparent);
      white-space: nowrap;
      transition: all 0.15s ease;
    }
    .tech-badge:hover {
      background: color-mix(in srgb, var(--badge-color, #38bdf8) 22%, var(--color-surface));
      transform: translateY(-1px);
    }
  `]
})
export class TechBadgeComponent {
  @Input({ required: true }) tech!: string;
  get color(): string {
    return TECH_COLORS[this.tech] ?? '#38bdf8';
  }
}
