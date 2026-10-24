import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, computed, effect, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { distinctUntilChanged, map } from 'rxjs';
import { PROJECT_CATEGORY_TRANSLATION_KEYS } from '../../core/constants/project-categories';
import { SITE } from '../../core/config/site';
import { PublicProject } from '../../core/models/public-project.model';
import { ProjectCatalogService } from '../../core/services/project-catalog.service';
import { SeoService } from '../../core/services/seo.service';
import { TranslationService } from '../../core/services/translation.service';
import { ProjectCoverComponent } from '../../shared/components/project-cover/project-cover.component';
import { IconComponent } from '../../shared/icons/icon.component';

@Component({
  selector: 'app-article',
  standalone: true,
  imports: [RouterLink, NgOptimizedImage, ProjectCoverComponent, IconComponent],
  templateUrl: './article.component.html',
  styleUrl: './article.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArticleComponent implements OnInit {
  readonly ts = inject(TranslationService);
  private readonly route = inject(ActivatedRoute);
  private readonly catalog = inject(ProjectCatalogService);
  private readonly seo = inject(SeoService);
  private readonly destroyRef = inject(DestroyRef);

  /** Route param: curated slug or row UUID. */
  readonly routeId = signal<string | null>(null);

  readonly loading = computed(() => this.catalog.loading() || (this.catalog.projects().length === 0 && !this.catalog.error()));

  readonly project = computed<PublicProject | null>(() => {
    const key = this.routeId();
    if (!key) {
      return null;
    }
    const id = this.catalog.idFor(key);
    return this.catalog.projects().find(p => p.id === id) ?? null;
  });

  readonly loadError = computed(() => !this.loading() && this.project() === null);

  /** Neighbours in the public list, for prev/next navigation. */
  readonly neighbours = computed(() => {
    const list = this.catalog.projects();
    const current = this.project();
    const index = current ? list.findIndex(p => p.id === current.id) : -1;
    if (index < 0 || list.length < 2) {
      return { prev: null, next: null };
    }
    return {
      prev: list[(index - 1 + list.length) % list.length],
      next: list[(index + 1) % list.length],
    };
  });

  constructor() {
    effect(() => {
      const project = this.project();
      const t = this.ts.t();
      if (project) {
        this.seo.update(
          {
            title: this.seo.compose(project.title),
            description: project.summary,
            path: `/projects/${project.slug}`,
            image: project.cover ? `${SITE.url}${project.cover}-1200.webp` : undefined,
          },
          this.ts.currentLang(),
        );
      } else if (this.loadError()) {
        this.seo.update(
          { title: this.seo.compose(t.seo_not_found_title), description: t.seo_not_found_desc, path: `/projects/${this.routeId() ?? ''}` },
          this.ts.currentLang(),
        );
      }
    });
  }

  ngOnInit(): void {
    // The router reuses this component when only :id changes (back/forward,
    // editing the hash, prev/next links), so the param must be read reactively.
    this.route.paramMap
      .pipe(
        map(params => params.get('id')),
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(id => this.routeId.set(id));
    void this.catalog.load();
  }

  categoryLabel(project: PublicProject): string {
    return this.ts.t()[PROJECT_CATEGORY_TRANSLATION_KEYS[project.category]];
  }

  statusLabel(project: PublicProject): string {
    const t = this.ts.t();
    if (project.status === 'completed') {
      return t.projects_status_completed;
    }
    if (project.status === 'in-progress') {
      return t.projects_status_wip;
    }
    return t.projects_status_planned;
  }
}
