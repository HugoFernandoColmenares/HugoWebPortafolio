import { ChangeDetectionStrategy, Component, OnInit, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs';
import { PROJECT_CATEGORIES } from '../../core/constants/project-categories';
import { ProjectCategory } from '../../core/models/portfolio-project.model';
import { ProjectCatalogService } from '../../core/services/project-catalog.service';
import { TranslationService } from '../../core/services/translation.service';
import { ProjectCaseCardComponent } from '../../shared/components/project-case-card/project-case-card.component';
import { ProjectIndexComponent } from '../../shared/components/project-index/project-index.component';

type Filter = ProjectCategory | 'all';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [ProjectCaseCardComponent, ProjectIndexComponent],
  templateUrl: './projects.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './projects.component.css',
})
export class ProjectsComponent implements OnInit {
  readonly ts = inject(TranslationService);
  readonly catalog = inject(ProjectCatalogService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  /** Filter lives in the URL (?type=desktop) so back/forward and sharing keep it. */
  readonly filter = toSignal(
    this.route.queryParamMap.pipe(
      map(params => {
        const type = params.get('type') as Filter | null;
        return type && (PROJECT_CATEGORIES as string[]).includes(type) ? type : 'all';
      }),
    ),
    { initialValue: 'all' as Filter },
  );

  readonly count = computed(() => this.ts.format('projects_index_count', { count: this.catalog.projects().length }));

  ngOnInit(): void {
    void this.catalog.load();
  }

  setFilter(filter: Filter): void {
    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { type: filter === 'all' ? null : filter },
      replaceUrl: true,
    });
  }
}
