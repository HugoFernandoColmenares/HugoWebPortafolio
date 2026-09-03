import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

const TECH_COLORS: Record<string, string> = {
  'Angular': 'var(--tech-angular)',
  '.NET Core': 'var(--tech-dotnet)',
  'C#': 'var(--tech-csharp)',
  'TypeScript': 'var(--tech-typescript)',
  'JavaScript': 'var(--tech-javascript)',
  'SQL Server': 'var(--tech-sql-server)',
  'PostgreSQL': 'var(--tech-postgresql)',
  'Docker': 'var(--tech-docker)',
  'Git': 'var(--tech-git)',
  'HTML': 'var(--tech-html)',
  'CSS': 'var(--tech-css)',
  'Node.js': 'var(--tech-nodejs)',
  'Python': 'var(--tech-python)',
  'Azure': 'var(--tech-azure)',
  'RxJS': 'var(--tech-rxjs)',
  'Entity Framework': 'var(--tech-ef)',
  'WPF': 'var(--tech-wpf)',
  'DDD': 'var(--tech-ddd)',
};

@Component({
  selector: 'app-tech-badge',
  standalone: true,
  imports: [],
  template: `<span class="tech-badge" [style.--badge-color]="color">{{ tech }}</span>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [`
    .tech-badge {
      display: inline-flex;
      align-items: center;
      padding: 0.4rem 1rem;
      border-radius: var(--radius-full);
      font-size: 1.2rem;
      font-weight: var(--font-weight-semibold);
      letter-spacing: 0.03em;
      background: color-mix(in srgb, var(--badge-color, var(--color-accent)) 12%, var(--color-surface));
      color: var(--badge-color, var(--color-accent));
      border: 1px solid color-mix(in srgb, var(--badge-color, var(--color-accent)) 30%, transparent);
      white-space: nowrap;
      transition: background-color var(--transition-fast);
    }
    .tech-badge:hover {
      background: color-mix(in srgb, var(--badge-color, var(--color-accent)) 22%, var(--color-surface));
    }
  `]
})
export class TechBadgeComponent {
  @Input({ required: true }) tech!: string;
  get color(): string {
    return TECH_COLORS[this.tech] ?? 'var(--color-accent)';
  }
}
