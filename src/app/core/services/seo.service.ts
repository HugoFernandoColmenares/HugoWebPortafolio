import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { SITE } from '../config/site';

export interface SeoData {
  title: string;
  description: string;
  /** Hash path without leading `#`, e.g. `/projects`. */
  path: string;
  image?: string;
}

/**
 * Per-route <title>, description and Open Graph / Twitter tags.
 * Crawlers that do not run JS read the static defaults in index.html;
 * this keeps the live document consistent for browsers, tabs and JS-aware bots.
 */
@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);

  update({ title, description, path, image }: SeoData, lang: string): void {
    const url = path === '/' || path === '/home' ? `${SITE.url}/` : `${SITE.url}/#${path}`;
    const ogImage = image ?? SITE.ogImage;

    this.title.setTitle(title);
    this.setName('description', description);
    this.setProperty('og:title', title);
    this.setProperty('og:description', description);
    this.setProperty('og:url', url);
    this.setProperty('og:image', ogImage);
    this.setProperty('og:locale', lang === 'es' ? 'es_CO' : 'en_US');
    this.setName('twitter:title', title);
    this.setName('twitter:description', description);
    this.setName('twitter:image', ogImage);
  }

  /** `Page · Hugo Colmenares` unless the title already carries the name. */
  compose(page: string): string {
    return page.includes(SITE.name) ? page : `${page} · ${SITE.name}`;
  }

  private setName(name: string, content: string): void {
    this.meta.updateTag({ name, content }, `name="${name}"`);
  }

  private setProperty(property: string, content: string): void {
    this.meta.updateTag({ property, content }, `property="${property}"`);
  }
}
