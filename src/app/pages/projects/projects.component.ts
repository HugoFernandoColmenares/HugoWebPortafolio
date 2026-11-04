import { DOCUMENT, Location } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PROJECT_CATEGORIES } from '../../core/constants/project-categories';
import { ProjectCategory } from '../../core/models/portfolio-project.model';
import { ProjectCatalogService } from '../../core/services/project-catalog.service';
import { TranslationService } from '../../core/services/translation.service';
import { ProjectCaseCardComponent } from '../../shared/components/project-case-card/project-case-card.component';
import { ProjectIndexComponent } from '../../shared/components/project-index/project-index.component';
import { IconComponent } from '../../shared/icons/icon.component';

type Filter = ProjectCategory | 'all';

function readFilter(value: string | null): Filter {
  return value && (PROJECT_CATEGORIES as string[]).includes(value) ? (value as Filter) : 'all';
}

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [ProjectCaseCardComponent, ProjectIndexComponent, IconComponent],
  templateUrl: './projects.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './projects.component.css',
})
export class ProjectsComponent implements OnInit {
  readonly ts = inject(TranslationService);
  readonly catalog = inject(ProjectCatalogService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly location = inject(Location);
  private readonly document = inject(DOCUMENT);

  /**
   * The filter is mirrored in the URL (?type=desktop) for sharing, but it is
   * kept in a local signal: using the router here made every filter change
   * scroll the page back to the projects header.
   */
  readonly filter = signal<Filter>(readFilter(this.route.snapshot.queryParamMap.get('type')));

  readonly count = computed(() => this.ts.format('projects_index_count', { count: this.catalog.projects().length }));

  ngOnInit(): void {
    void this.catalog.load();
  }

  setFilter(filter: Filter): void {
    this.filter.set(filter);
    const url = this.router.serializeUrl(
      this.router.createUrlTree([], {
        relativeTo: this.route,
        queryParams: { type: filter === 'all' ? null : filter },
      }),
    );
    this.location.replaceState(url);
  }

  scrollToSection(id: string): void {
    // Global CSS owns smooth scrolling and disables it for reduced-motion users.
    this.document.getElementById(id)?.scrollIntoView({ block: 'start' });
  }
}
