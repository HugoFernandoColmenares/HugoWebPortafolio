import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import {
  CategoryOption,
  PortfolioProject,
  PortfolioProjectInput,
  ProjectCreatorViewMode,
  ProjectFormLabels,
  ProjectTableLabels,
} from '../../core/models/portfolio-project.model';
import {
  PROJECT_CATEGORIES,
  PROJECT_CATEGORY_TRANSLATION_KEYS,
} from '../../core/constants/project-categories';
import { PortfolioProjectService } from '../../core/services/portfolio-project.service';
import { NotificationService } from '../../core/services/notification.service';
import { TranslationService } from '../../core/services/translation.service';
import { ProjectFormComponent } from './form/form.component';
import { ProjectTableComponent } from './table/table.component';

@Component({
  selector: 'app-project-creator',
  standalone: true,
  imports: [ProjectTableComponent, ProjectFormComponent],
  templateUrl: './project-creator.component.html',
  styleUrl: './project-creator.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectCreatorComponent implements OnInit {
  private readonly projectService = inject(PortfolioProjectService);
  private readonly notifications = inject(NotificationService);
  readonly ts = inject(TranslationService);

  readonly viewMode = signal<ProjectCreatorViewMode>('list');
  readonly projects = signal<PortfolioProject[]>([]);
  readonly selectedProject = signal<PortfolioProject | null>(null);
  readonly loading = signal(false);
  readonly saving = signal(false);

  readonly tableLabels = computed<ProjectTableLabels>(() => {
    const t = this.ts.t();
    return {
      title: t.admin_project_title,
      subtitle: t.admin_project_subtitle,
      add: t.admin_project_add,
      empty: t.admin_project_empty,
      filterSearch: t.admin_project_filter_search,
      filterCategory: t.admin_project_filter_category,
      filterCategoryPlaceholder: t.admin_project_filter_category_placeholder,
      columnTitle: t.admin_project_col_title,
      columnCategory: t.admin_project_col_category,
      columnStatus: t.admin_project_col_status,
      columnTechnologies: t.admin_project_col_technologies,
      columnFeatured: t.admin_project_col_featured,
      columnActions: t.admin_project_col_actions,
      featuredYes: t.admin_project_featured_yes,
      featuredNo: t.admin_project_featured_no,
      view: t.admin_project_action_view,
      edit: t.admin_project_action_edit,
      delete: t.admin_project_action_delete,
      statusCompleted: t.admin_project_status_completed,
      statusInProgress: t.admin_project_status_in_progress,
      statusPlanned: t.admin_project_status_planned,
    };
  });

  readonly formLabels = computed<ProjectFormLabels>(() => {
    const t = this.ts.t();
    return {
      createTitle: t.admin_project_form_create,
      editTitle: t.admin_project_form_edit,
      viewTitle: t.admin_project_form_view,
      title: t.admin_project_field_title,
      description: t.admin_project_field_description,
      imageUrl: t.admin_project_field_image_url,
      technologies: t.admin_project_field_technologies,
      technologiesHint: t.admin_project_field_technologies_hint,
      githubUrl: t.admin_project_field_github_url,
      liveUrl: t.admin_project_field_live_url,
      featured: t.admin_project_field_featured,
      status: t.admin_project_field_status,
      category: t.admin_project_field_category,
      save: t.admin_project_save,
      cancel: t.admin_project_cancel,
      statusCompleted: t.admin_project_status_completed,
      statusInProgress: t.admin_project_status_in_progress,
      statusPlanned: t.admin_project_status_planned,
    };
  });

  readonly categoryOptions = computed<CategoryOption[]>(() => {
    const t = this.ts.t();
    return PROJECT_CATEGORIES.map(category => ({
      value: category,
      label: t[PROJECT_CATEGORY_TRANSLATION_KEYS[category]],
    }));
  });

  readonly formMode = computed<Exclude<ProjectCreatorViewMode, 'list'>>(() =>
    this.viewMode() as Exclude<ProjectCreatorViewMode, 'list'>,
  );

  ngOnInit(): void {
    void this.loadProjects();
  }

  onAddProject(): void {
    this.selectedProject.set(null);
    this.viewMode.set('create');
  }

  onViewProject(project: PortfolioProject): void {
    this.selectedProject.set(project);
    this.viewMode.set('view');
  }

  onEditProject(project: PortfolioProject): void {
    this.selectedProject.set(project);
    this.viewMode.set('edit');
  }

  async onDeleteProject(project: PortfolioProject): Promise<void> {
    const t = this.ts.t();
    const confirmed = await this.notifications.confirm({
      title: t.admin_project_delete_confirm_title,
      message: t.admin_project_delete_confirm_message,
      confirmText: t.admin_project_delete_confirm_yes,
      cancelText: t.admin_project_delete_confirm_no,
      type: 'warning',
    });

    if (!confirmed) {
      return;
    }

    try {
      this.loading.set(true);
      await this.projectService.softDelete(project.id);
      this.projects.update(items => items.filter(item => item.id !== project.id));
      void this.notifications.success(t.admin_project_delete_success);
    } catch {
      void this.notifications.error(t.admin_project_delete_error);
    } finally {
      this.loading.set(false);
    }
  }

  async onSaveProject(input: PortfolioProjectInput): Promise<void> {
    const t = this.ts.t();

    try {
      this.saving.set(true);
      const mode = this.viewMode();
      const selected = this.selectedProject();

      if (mode === 'edit' && selected) {
        await this.projectService.update(selected.id, input);
      } else {
        await this.projectService.create(input);
      }

      await this.loadProjects();
      this.viewMode.set('list');
      this.selectedProject.set(null);
      void this.notifications.success(t.admin_project_save_success);
    } catch {
      void this.notifications.error(t.admin_project_save_error);
    } finally {
      this.saving.set(false);
    }
  }

  onCancelForm(): void {
    this.viewMode.set('list');
    this.selectedProject.set(null);
  }

  private async loadProjects(): Promise<void> {
    const t = this.ts.t();

    try {
      this.loading.set(true);
      const data = await this.projectService.getAll();
      this.projects.set(data);
    } catch {
      void this.notifications.error(t.admin_project_load_error);
    } finally {
      this.loading.set(false);
    }
  }
}
