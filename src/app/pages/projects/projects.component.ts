import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import {
  CategoryOption,
  PortfolioProject,
  ProjectCategorySection,
  ProjectsPageView,
  ProjectTableLabels,
} from '../../core/models/portfolio-project.model';
import { DataTableAction, DataTableActionEvent } from '../../core/models/data-table.model';
import {
  PROJECT_CATEGORIES,
  PROJECT_CATEGORY_TRANSLATION_KEYS,
} from '../../core/constants/project-categories';
import { PortfolioProjectService } from '../../core/services/portfolio-project.service';
import { TranslationService } from '../../core/services/translation.service';
import {
  buildPortfolioTableColumns,
  buildPortfolioTableFilters,
  portfolioTableCopyFromLabels,
} from '../../core/utils/portfolio-table.util';
import { DataTableComponent } from '../../shared/components/data-table/data-table.component';
import { ProjectCardComponent } from '../../shared/components/project-card/project-card.component';
import { ProjectCarouselComponent } from '../../shared/components/project-carousel/project-carousel.component';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [ProjectCarouselComponent, DataTableComponent, ProjectCardComponent],
  templateUrl: './projects.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './projects.component.css',
})
export class ProjectsComponent implements OnInit {
  readonly ts = inject(TranslationService);
  private readonly projectService = inject(PortfolioProjectService);
  private readonly router = inject(Router);

  readonly projects = signal<PortfolioProject[]>([]);
  readonly loading = signal(true);
  readonly loadError = signal(false);
  readonly view = signal<ProjectsPageView>('carousel');

  readonly categoryOptions = computed<CategoryOption[]>(() => {
    const t = this.ts.t();
    return PROJECT_CATEGORIES.map(category => ({
      value: category,
      label: t[PROJECT_CATEGORY_TRANSLATION_KEYS[category]],
    }));
  });

  readonly tableLabels = computed<ProjectTableLabels>(() => {
    const t = this.ts.t();
    return {
      title: t.projects_table_title,
      subtitle: t.projects_table_subtitle,
      add: '',
      empty: t.projects_empty_filter,
      filterSearch: t.admin_project_filter_search,
      filterCategory: t.admin_project_filter_category,
      filterCategoryPlaceholder: t.admin_project_filter_category_placeholder,
      filterStatus: t.admin_project_filter_status,
      filterStatusPlaceholder: t.admin_project_filter_status_placeholder,
      filterFeatured: t.admin_project_filter_featured,
      filterFeaturedPlaceholder: t.admin_project_filter_featured_placeholder,
      columnTitle: t.admin_project_col_title,
      columnCategory: t.admin_project_col_category,
      columnStatus: t.admin_project_col_status,
      columnTechnologies: t.admin_project_col_technologies,
      columnFeatured: t.admin_project_col_featured,
      columnActions: t.admin_project_col_actions,
      featuredYes: t.admin_project_featured_yes,
      featuredNo: t.admin_project_featured_no,
      view: t.btn_article,
      edit: '',
      delete: '',
      statusCompleted: t.projects_status_completed,
      statusInProgress: t.projects_status_wip,
      statusPlanned: t.projects_status_planned,
    };
  });

  readonly filters = computed(() =>
    buildPortfolioTableFilters(portfolioTableCopyFromLabels(this.tableLabels()), this.categoryOptions(), true),
  );

  readonly columns = computed(() =>
    buildPortfolioTableColumns(portfolioTableCopyFromLabels(this.tableLabels()), this.categoryOptions(), true),
  );

  readonly actions = computed<DataTableAction<PortfolioProject>[]>(() => [
    { id: 'article', label: this.ts.t().btn_article, icon: 'view' },
    {
      id: 'github',
      label: this.ts.t().btn_github,
      icon: 'link',
      visible: row => Boolean(row.githubUrl),
    },
  ]);

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

  setView(view: ProjectsPageView): void {
    this.view.set(view);
  }

  onTableAction(event: DataTableActionEvent<PortfolioProject>): void {
    if (event.id === 'article') {
      void this.router.navigate(['/projects', event.row.id]);
      return;
    }

    if (event.row.githubUrl) {
      window.open(event.row.githubUrl, '_blank', 'noopener,noreferrer');
    }
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
