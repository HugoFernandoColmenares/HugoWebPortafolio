import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { PublicProject } from '../../../core/models/public-project.model';

/**
 * Project cover: optimized local WebP (NgOptimizedImage + srcset), a remote
 * image for uncurated rows, or a generated "terminal card" when there is no
 * real screenshot (never stock photos).
 */
@Component({
  selector: 'app-project-cover',
  standalone: true,
  imports: [NgOptimizedImage],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (project().cover; as cover) {
      <img
        [ngSrc]="cover"
        ngSrcset="480w, 800w, 1200w"
        [sizes]="sizes()"
        width="1200"
        height="750"
        [priority]="priority()"
        [alt]="alt()"
        class="cover__img"
      />
    } @else if (project().remoteCover; as remote) {
      <img [src]="remote" [alt]="alt()" width="1200" height="750" loading="lazy" decoding="async" class="cover__img" />
    } @else {
      <div class="cover__generated grid-bg" role="img" [attr.aria-label]="alt()">
        <span class="cover__path"><span class="prompt">~/</span>projects/{{ project().slug }}</span>
        <span class="cover__title">{{ project().title }}</span>
        <span class="cover__stack">{{ stackLine() }}</span>
      </div>
    }
  `,
  styles: `
    :host {
      display: block;
      position: relative;
      aspect-ratio: 16 / 10;
      overflow: hidden;
      background: var(--color-surface-2);
    }
    .cover__img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: top center;
    }
    .cover__generated {
      position: absolute;
      inset: 0;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      gap: 0.8rem;
      padding: clamp(1.6rem, 4%, 3.2rem);
      background-color: #111315;
      color: #e5e7eb;
      --color-grid: rgba(243, 244, 246, 0.06);
    }
    .cover__path, .cover__stack { font-family: var(--font-mono); font-size: 1.2rem; color: #9ba2ab; }
    .cover__path .prompt { color: #a3e635; }
    .cover__title { font-size: clamp(2rem, 3vw, 3rem); font-weight: 700; letter-spacing: -0.03em; line-height: 1.1; color: #f3f4f6; }
  `,
})
export class ProjectCoverComponent {
  readonly project = input.required<PublicProject>();
  readonly priority = input(false);
  readonly sizes = input('(max-width: 760px) 100vw, 50vw');
  readonly alt = computed(() => this.project().title);
  readonly stackLine = computed(() => this.project().technologies.slice(0, 4).join(' · '));
}
