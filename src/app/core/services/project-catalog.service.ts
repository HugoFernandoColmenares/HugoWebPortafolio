import { Injectable, computed, inject, signal } from '@angular/core';
import { PROJECT_CURATION, ProjectCuration } from '../data/project-curation';
import { PortfolioProject } from '../models/portfolio-project.model';
import { PublicProject } from '../models/public-project.model';
import { PortfolioProjectService } from './portfolio-project.service';
import { Language, TranslationService } from './translation.service';

const STOCK_HOSTS = /(^|\.)unsplash\.com$|(^|\.)pexels\.com$|(^|\.)pixabay\.com$/i;

/** First sentence-ish summary for rows without curated copy. */
function summarize(text: string): string {
  const first = text.split(/(?<=\.)\s/)[0] ?? text;
  return first.length > 180 ? `${first.slice(0, 177).trimEnd()}…` : first;
}

function remoteCover(url: string): string | null {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'https:' && !STOCK_HOSTS.test(parsed.hostname) ? url : null;
  } catch {
    return null;
  }
}

export function toPublicProject(row: PortfolioProject, lang: Language, curation?: ProjectCuration): PublicProject {
  const description = curation?.description?.[lang] ?? curation?.description?.en ?? row.description;
  return {
    id: row.id,
    slug: curation?.slug ?? row.id,
    title: curation?.title ?? row.title,
    summary: curation?.summary[lang] || summarize(description),
    description,
    technologies: row.technologies,
    githubUrl: curation?.githubUrl === undefined ? row.githubUrl : curation.githubUrl,
    liveUrl: curation?.liveUrl === undefined ? row.liveUrl : curation.liveUrl,
    contentWarning: curation?.contentWarning ?? false,
    featured: curation ? curation.featured : row.featured,
    rank: curation?.rank ?? 100,
    status: row.status,
    category: row.category,
    cover: curation ? curation.cover : null,
    remoteCover: curation ? null : remoteCover(row.imageUrl),
    caseStudy: curation?.caseStudy ?? null,
    related: curation?.related ?? [],
    gallery: curation?.gallery ?? [],
    updatedAt: row.updatedAt,
  };
}

/**
 * Loads projects once per session and exposes them in the current language,
 * merged with the public curation layer. Hidden rows are filtered out.
 */
@Injectable({ providedIn: 'root' })
export class ProjectCatalogService {
  private readonly api = inject(PortfolioProjectService);
  private readonly ts = inject(TranslationService);

  private readonly rows = signal<PortfolioProject[]>([]);
  private pending: Promise<void> | null = null;

  readonly loading = signal(false);
  readonly error = signal(false);

  readonly projects = computed<PublicProject[]>(() => {
    const lang = this.ts.currentLang();
    return this.rows()
      .filter(row => !PROJECT_CURATION[row.id]?.hidden)
      .map(row => toPublicProject(row, lang, PROJECT_CURATION[row.id]));
  });

  readonly featured = computed(() =>
    this.projects()
      .filter(project => project.featured)
      .sort((a, b) => a.rank - b.rank),
  );

  load(): Promise<void> {
    if (this.rows().length) {
      return Promise.resolve();
    }
    if (!this.pending) {
      this.loading.set(true);
      this.error.set(false);
      this.pending = this.api
        .getAll()
        .then(rows => this.rows.set(rows))
        .catch(() => {
          this.error.set(true);
          this.pending = null;
        })
        .finally(() => this.loading.set(false));
    }
    return this.pending ?? Promise.resolve();
  }

  /** Accepts the row UUID (canonical) or the curated slug. */
  idFor(idOrSlug: string): string {
    const match = Object.entries(PROJECT_CURATION).find(([, c]) => c.slug === idOrSlug);
    return match ? match[0] : idOrSlug;
  }

  isHidden(id: string): boolean {
    return Boolean(PROJECT_CURATION[id]?.hidden);
  }

  localize(row: PortfolioProject): PublicProject {
    return toPublicProject(row, this.ts.currentLang(), PROJECT_CURATION[row.id]);
  }
}
