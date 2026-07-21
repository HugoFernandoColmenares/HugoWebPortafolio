import { Component, computed, inject, OnInit, signal, ChangeDetectionStrategy } from '@angular/core';

import { PortfolioProject } from '../../core/models/portfolio-project.model';
import { PortfolioProjectService } from '../../core/services/portfolio-project.service';
import { TranslationService } from '../../core/services/translation.service';
import { ProjectCardComponent } from '../../shared/components/project-card/project-card.component';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [ProjectCardComponent],
  templateUrl: './projects.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './projects.component.css'
})
export class ProjectsComponent implements OnInit {
  readonly ts = inject(TranslationService);
  private readonly projectService = inject(PortfolioProjectService);

  readonly activeFilter = signal('All');
  readonly projects = signal<PortfolioProject[]>([]);
  readonly loading = signal(true);
  readonly loadError = signal(false);

  readonly allFilters = computed(() => {
    const technologies = this.projects().flatMap(p => p.technologies);
    const uniqueTechs = [...new Set(technologies)].sort();
    return ['All', ...uniqueTechs];
  });

  readonly filteredProjects = computed(() => {
    const filter = this.activeFilter();
    const items = this.projects();
    if (filter === 'All') {
      return items;
    }
    return items.filter(p => p.technologies.includes(filter));
  });

  ngOnInit(): void {
    void this.loadProjects();
  }

  setFilter(filter: string): void {
    this.activeFilter.set(filter);
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
