import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { distinctUntilChanged, map } from 'rxjs';
import { PortfolioProject } from '../../core/models/portfolio-project.model';
import { PROJECT_CATEGORY_TRANSLATION_KEYS } from '../../core/constants/project-categories';
import { PortfolioProjectService } from '../../core/services/portfolio-project.service';
import { TranslationService } from '../../core/services/translation.service';
import { TechBadgeComponent } from '../../shared/components/tech-badge/tech-badge.component';

@Component({
  selector: 'app-article',
  standalone: true,
  imports: [RouterLink, TechBadgeComponent],
  templateUrl: './article.component.html',
  styleUrl: './article.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArticleComponent implements OnInit {
  readonly ts = inject(TranslationService);
  private readonly route = inject(ActivatedRoute);
  private readonly projectService = inject(PortfolioProjectService);
  private readonly destroyRef = inject(DestroyRef);
  private requestId = 0;

  readonly project = signal<PortfolioProject | null>(null);
  readonly loading = signal(true);
  readonly loadError = signal(false);

  ngOnInit(): void {
    // The router reuses this component when only :id changes (back/forward,
    // editing the hash, prev/next links), so the param must be read reactively.
    this.route.paramMap
      .pipe(
        map(params => params.get('id')),
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(id => void this.loadProject(id));
  }

  categoryLabel(project: PortfolioProject): string {
    return this.ts.t()[PROJECT_CATEGORY_TRANSLATION_KEYS[project.category]];
  }

  statusLabel(project: PortfolioProject): string {
    if (project.status === 'completed') {
      return this.ts.t().projects_status_completed;
    }
    if (project.status === 'in-progress') {
      return this.ts.t().projects_status_wip;
    }
    return this.ts.t().projects_status_planned;
  }

  publishedOn(project: PortfolioProject): string {
    return project.updatedAt.slice(0, 10);
  }

  hasRemoteCover(project: PortfolioProject): boolean {
    return /^https:\/\//i.test(project.imageUrl);
  }

  private async loadProject(id: string | null): Promise<void> {
    const request = ++this.requestId;

    if (!id) {
      this.loadError.set(true);
      this.loading.set(false);
      return;
    }

    this.loading.set(true);
    this.loadError.set(false);

    try {
      const project = await this.projectService.getById(id);
      if (request !== this.requestId) {
        return;
      }
      this.project.set(project);
      this.loadError.set(project === null);
    } catch {
      if (request !== this.requestId) {
        return;
      }
      this.loadError.set(true);
      this.project.set(null);
    } finally {
      if (request === this.requestId) {
        this.loading.set(false);
      }
    }
  }
}
