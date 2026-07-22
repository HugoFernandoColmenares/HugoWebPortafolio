import { Component, Input, inject, ChangeDetectionStrategy } from '@angular/core';
import { PortfolioProject } from '../../../core/models/portfolio-project.model';
import { PROJECT_CATEGORY_TRANSLATION_KEYS } from '../../../core/constants/project-categories';
import { TechBadgeComponent } from '../tech-badge/tech-badge.component';
import { TranslationService } from '../../../core/services/translation.service';

@Component({
  selector: 'app-project-card',
  standalone: true,
  imports: [TechBadgeComponent],
  template: `
    <article class="card" [class.card--featured]="project.featured">
      @if (project.featured) {
        <div class="card__featured-badge">⭐ Featured</div>
      }

      <div class="card__image-wrapper">
        <img [src]="project.imageUrl" [alt]="project.title" class="card__image" loading="lazy" />
        <div class="card__image-overlay">
          <div class="card__links">
            @if (project.githubUrl) {
              <a [href]="project.githubUrl" target="_blank" rel="noopener" class="card__link card__link--github">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                </svg>
                {{ ts.t()['btn_github'] }}
              </a>
            }
            @if (project.liveUrl) {
              <a [href]="project.liveUrl" target="_blank" rel="noopener" class="card__link card__link--live">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
                </svg>
                {{ ts.t()['btn_live'] }}
              </a>
            }
          </div>
        </div>
      </div>

      <div class="card__body">
        <div class="card__meta">
          <span [class]="'card__status card__status--' + project.status">
            @switch (project.status) {
              @case ('completed') { {{ ts.t().projects_status_completed }} }
              @case ('in-progress') { {{ ts.t().projects_status_wip }} }
              @default { {{ ts.t().projects_status_planned }} }
            }
          </span>
          <span class="card__category">{{ categoryLabel() }}</span>
        </div>
        <h3 class="card__title">{{ project.title }}</h3>
        <p class="card__description">{{ project.description }}</p>
        <div class="card__techs">
          @for (tech of project.technologies; track tech) {
            <app-tech-badge [tech]="tech" />
          }
        </div>
      </div>
    </article>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectCardComponent {
  @Input({ required: true }) project!: PortfolioProject;
  readonly ts = inject(TranslationService);

  categoryLabel(): string {
    const key = PROJECT_CATEGORY_TRANSLATION_KEYS[this.project.category];
    return this.ts.t()[key];
  }
}
