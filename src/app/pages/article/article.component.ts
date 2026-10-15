import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
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

  readonly project = signal<PortfolioProject | null>(null);
  readonly loading = signal(true);
  readonly loadError = signal(false);

  ngOnInit(): void {
    void this.loadProject();
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

  private async loadProject(): Promise<void> {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.loadError.set(true);
      this.loading.set(false);
      return;
    }

    try {
      this.loading.set(true);
      this.project.set(await this.projectService.getById(id));
      this.loadError.set(this.project() === null);
    } catch {
      this.loadError.set(true);
      this.project.set(null);
    } finally {
      this.loading.set(false);
    }
  }
}
