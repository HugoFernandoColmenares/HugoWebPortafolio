import { Component, computed, inject, OnInit, signal, ChangeDetectionStrategy } from '@angular/core';

import {
  PortfolioProject,
  ProjectCategorySection,
} from '../../core/models/portfolio-project.model';
import {
  PROJECT_CATEGORIES,
  PROJECT_CATEGORY_TRANSLATION_KEYS,
} from '../../core/constants/project-categories';
import { PortfolioProjectService } from '../../core/services/portfolio-project.service';
import { TranslationService } from '../../core/services/translation.service';
import { ProjectCarouselComponent } from '../../shared/components/project-carousel/project-carousel.component';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [ProjectCarouselComponent],
  templateUrl: './projects.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './projects.component.css'
})
export class ProjectsComponent implements OnInit {
  readonly ts = inject(TranslationService);
  private readonly projectService = inject(PortfolioProjectService);

  readonly projects = signal<PortfolioProject[]>([]);
  readonly loading = signal(true);
  readonly loadError = signal(false);

  readonly categorySections = computed<ProjectCategorySection[]>(() => {
    const t = this.ts.t();
    const items = this.projects();

    return PROJECT_CATEGORIES.map(category => ({
      category,
      label: t[PROJECT_CATEGORY_TRANSLATION_KEYS[category]],
      projects: items.filter(project => project.category === category),
    })).filter(section => section.projects.length > 0);
  });

  ngOnInit(): void {
    void this.loadProjects();
  }

  private async loadProjects(): Promise<void> {
    try {
      this.loading.set(true);
      this.loadError.set(false);
      this.projects.set(await this.projectService.getAll());
    } catch {
      this.loadError.set(true);
      this.projects.set([]);
    } finally {
      this.loading.set(false);
    }
  }
}
