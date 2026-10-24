import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PROJECT_CATEGORIES, PROJECT_CATEGORY_TRANSLATION_KEYS } from '../../../core/constants/project-categories';
import { ProjectCategory } from '../../../core/models/portfolio-project.model';
import { PublicProject } from '../../../core/models/public-project.model';
import { TranslationService } from '../../../core/services/translation.service';
import { IconComponent } from '../../icons/icon.component';

/** Compact, filterable list of every public project. */
@Component({
  selector: 'app-project-index',
  standalone: true,
  imports: [RouterLink, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './project-index.component.html',
  styleUrl: './project-index.component.css',
})
export class ProjectIndexComponent {
  readonly projects = input.required<PublicProject[]>();
  readonly filter = input<ProjectCategory | 'all'>('all');
  readonly filterChange = output<ProjectCategory | 'all'>();

  readonly ts = inject(TranslationService);

  readonly filters = computed(() => {
    const t = this.ts.t();
    const items = this.projects();
    const options = PROJECT_CATEGORIES.map(category => ({
      value: category as ProjectCategory | 'all',
      label: t[PROJECT_CATEGORY_TRANSLATION_KEYS[category]],
      count: items.filter(p => p.category === category).length,
    })).filter(option => option.count > 0);
    return [{ value: 'all' as const, label: t.projects_filter_all, count: items.length }, ...options];
  });

  readonly visible = computed(() => {
    const active = this.filter();
    return this.projects().filter(p => active === 'all' || p.category === active);
  });

  categoryLabel(project: PublicProject): string {
    return this.ts.t()[PROJECT_CATEGORY_TRANSLATION_KEYS[project.category]];
  }

  statusLabel(project: PublicProject): string {
    const t = this.ts.t();
    return project.status === 'completed'
      ? t.projects_status_completed
      : project.status === 'in-progress'
        ? t.projects_status_wip
        : t.projects_status_planned;
  }
}
