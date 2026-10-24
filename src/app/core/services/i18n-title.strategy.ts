import { Injectable, effect, inject, untracked } from '@angular/core';
import { RouterStateSnapshot, TitleStrategy } from '@angular/router';
import { SeoService } from './seo.service';
import { TranslationKey, TranslationService } from './translation.service';

/** Route `data.seo` names a page; titles/descriptions come from translations. */
export type SeoPage = 'home' | 'projects' | 'about' | 'contact' | 'private' | 'not_found';

/**
 * Sets the document title and meta description per route, in the active
 * language, and re-applies them when the language changes. Pages that own
 * their SEO (project detail) set `data.seo = 'self'` and call SeoService.
 */
@Injectable({ providedIn: 'root' })
export class I18nTitleStrategy extends TitleStrategy {
  private readonly ts = inject(TranslationService);
  private readonly seo = inject(SeoService);
  private current: { page: SeoPage; path: string } | null = null;

  constructor() {
    super();
    effect(() => {
      this.ts.currentLang();
      untracked(() => this.apply());
    });
  }

  override updateTitle(snapshot: RouterStateSnapshot): void {
    let route = snapshot.root;
    let page: SeoPage | 'self' | undefined;
    while (route) {
      page = (route.data['seo'] as SeoPage | 'self' | undefined) ?? page;
      route = route.firstChild!;
    }
    if (page === 'self') {
      this.current = null;
      return;
    }
    const path = snapshot.url.split('?')[0] || '/';
    this.current = { page: page ?? 'not_found', path };
    this.apply();
  }

  private apply(): void {
    if (!this.current) {
      return;
    }
    const { page, path } = this.current;
    const t = this.ts.t();
    const title = t[`seo_${page}_title` as TranslationKey];
    const description = t[`seo_${page}_desc` as TranslationKey];
    this.seo.update(
      { title: page === 'home' ? title : this.seo.compose(title), description, path },
      this.ts.currentLang(),
    );
  }
}
