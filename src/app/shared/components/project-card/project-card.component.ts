import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Project } from '../../../core/models/project.model';
import { TechBadgeComponent } from '../tech-badge/tech-badge.component';
import { TranslationService } from '../../../core/services/translation.service';

@Component({
  selector: 'app-project-card',
  standalone: true,
  imports: [CommonModule, TechBadgeComponent],
  template: `
    <article class="card" [class.card--featured]="project.featured">
      @if (project.featured) {
        <div class="card__featured-badge">⭐ Featured</div>
      }

      <div class="card__image-wrapper">
        <img [src]="project.imageUrl" [alt]="project.titleKey" class="card__image" loading="lazy" />
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
        <div [class]="'card__status card__status--' + project.status">
          {{ project.status === 'completed' ? ts.t()['projects_status_completed'] : ts.t()['projects_status_wip'] }}
        </div>
        <h3 class="card__title">{{ project.titleKey }}</h3>
        <p class="card__description">{{ project.descriptionKey }}</p>
        <div class="card__techs">
          @for (tech of project.technologies; track tech) {
            <app-tech-badge [tech]="tech" />
          }
        </div>
      </div>
    </article>
  `,
  styles: [`
    .card {
      background: var(--color-surface, #fff);
      border: 1px solid var(--color-border, #e2e8f0);
      border-radius: 2rem;
      overflow: hidden;
      transition: all 0.25s ease;
      display: flex;
      flex-direction: column;
      position: relative;
    }
    .card:hover {
      transform: translateY(-6px);
      box-shadow: var(--shadow-lg, 0 20px 40px rgba(0,0,0,0.15));
      border-color: var(--color-accent, #38bdf8);
    }
    .card--featured {
      border-color: var(--color-accent, #38bdf8);
      box-shadow: 0 0 0 1px var(--color-accent, #38bdf8);
    }

    .card__featured-badge {
      position: absolute;
      top: 1.2rem;
      right: 1.2rem;
      z-index: 2;
      background: linear-gradient(135deg, #38bdf8, #818cf8);
      color: white;
      font-size: 1.1rem;
      font-weight: 700;
      padding: 0.4rem 1rem;
      border-radius: 9999px;
    }

    .card__image-wrapper {
      position: relative;
      overflow: hidden;
      aspect-ratio: 16 / 9;
      background: var(--color-surface-2, #f1f5f9);
    }
    .card__image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.4s ease;
    }
    .card:hover .card__image { transform: scale(1.05); }

    .card__image-overlay {
      position: absolute;
      inset: 0;
      background: rgba(15, 23, 42, 0.7);
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: opacity 0.25s ease;
      backdrop-filter: blur(4px);
    }
    .card:hover .card__image-overlay { opacity: 1; }

    .card__links { display: flex; gap: 1.2rem; }

    .card__link {
      display: inline-flex;
      align-items: center;
      gap: 0.6rem;
      padding: 0.8rem 1.6rem;
      border-radius: 1.2rem;
      font-size: 1.3rem;
      font-weight: 600;
      text-decoration: none;
      transition: all 0.15s ease;
    }
    .card__link--github {
      background: rgba(255,255,255,0.15);
      color: white;
      border: 1px solid rgba(255,255,255,0.3);
    }
    .card__link--github:hover { background: rgba(255,255,255,0.25); color: white; }
    .card__link--live {
      background: #38bdf8;
      color: white;
    }
    .card__link--live:hover { background: #0ea5e9; color: white; }

    .card__body {
      padding: 2.4rem;
      display: flex;
      flex-direction: column;
      gap: 1.2rem;
      flex: 1;
    }

    .card__status {
      font-size: 1.1rem;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }
    .card__status--completed { color: #22c55e; }
    .card__status--in-progress { color: #f59e0b; }
    .card__status--planned { color: var(--color-text-muted, #64748b); }

    .card__title {
      font-size: 1.8rem;
      font-weight: 700;
      color: var(--color-text-heading, #0f172a);
      margin: 0;
    }

    .card__description {
      font-size: 1.4rem;
      color: var(--color-text-muted, #64748b);
      line-height: 1.6;
      flex: 1;
      margin: 0;
    }

    .card__techs {
      display: flex;
      flex-wrap: wrap;
      gap: 0.6rem;
      margin-top: auto;
      padding-top: 0.8rem;
      border-top: 1px solid var(--color-divider, rgba(0,0,0,0.08));
    }
  `]
})
export class ProjectCardComponent {
  @Input({ required: true }) project!: Project;
  readonly ts = inject(TranslationService);
}
