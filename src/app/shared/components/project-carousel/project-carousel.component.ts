import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  Injector,
  input,
  viewChild,
} from '@angular/core';
import { PortfolioProject } from '../../../core/models/portfolio-project.model';
import { TranslationService } from '../../../core/services/translation.service';
import { ProjectCardComponent } from '../project-card/project-card.component';

@Component({
  selector: 'app-project-carousel',
  standalone: true,
  imports: [ProjectCardComponent],
  templateUrl: './project-carousel.component.html',
  styleUrl: './project-carousel.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectCarouselComponent {
  private static readonly PX_PER_SEC = 28;
  private static nextId = 0;

  readonly title = input.required<string>();
  readonly projects = input.required<PortfolioProject[]>();
  readonly ts = inject(TranslationService);
  readonly titleId = `carousel-title-${++ProjectCarouselComponent.nextId}`;

  private readonly injector = inject(Injector);
  private readonly destroyRef = inject(DestroyRef);
  private readonly trackRef = viewChild<ElementRef<HTMLElement>>('track');

  private offset = 0;
  private loopWidth = 0;
  private rafId = 0;
  private lastTs = 0;
  private paused = false;
  private reduceMotion = false;

  constructor() {
    afterNextRender(() => this.setup(), { injector: this.injector });
  }

  scroll(direction: -1 | 1): void {
    this.measure();
    this.offset = this.wrap(this.offset + direction * this.slideStep());
    this.applyTransform();
  }

  onTrackKeydown(event: KeyboardEvent): void {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      this.scroll(-1);
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      this.scroll(1);
    }
  }

  setPaused(value: boolean): void {
    this.paused = value;
    if (!value && !this.reduceMotion) {
      this.lastTs = 0;
      this.startLoop();
    }
  }

  private setup(): void {
    this.reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.measure();
    if (!this.reduceMotion) {
      this.startLoop();
    }

    const onResize = (): void => this.measure();
    const onVisibility = (): void => {
      if (document.hidden) {
        this.stopLoop();
      } else if (!this.reduceMotion) {
        this.lastTs = 0;
        this.startLoop();
      }
    };

    window.addEventListener('resize', onResize, { passive: true });
    document.addEventListener('visibilitychange', onVisibility);

    this.destroyRef.onDestroy(() => {
      this.stopLoop();
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVisibility);
    });
  }

  private startLoop(): void {
    if (this.rafId || this.reduceMotion) {
      return;
    }

    const tick = (now: number): void => {
      if (this.paused || document.hidden) {
        this.lastTs = 0;
        this.rafId = requestAnimationFrame(tick);
        return;
      }

      const dt = this.lastTs ? Math.min(now - this.lastTs, 48) : 16;
      this.lastTs = now;
      this.offset = this.wrap(this.offset + (ProjectCarouselComponent.PX_PER_SEC * dt) / 1000);
      this.applyTransform();
      this.rafId = requestAnimationFrame(tick);
    };

    this.rafId = requestAnimationFrame(tick);
  }

  private stopLoop(): void {
    cancelAnimationFrame(this.rafId);
    this.rafId = 0;
    this.lastTs = 0;
  }

  private measure(): void {
    const track = this.trackRef()?.nativeElement;
    if (!track) {
      return;
    }

    const originalCount = this.projects().length;
    if (originalCount === 0) {
      this.loopWidth = 0;
      return;
    }

    this.loopWidth = track.scrollWidth / 2;
  }

  private slideStep(): number {
    const track = this.trackRef()?.nativeElement;
    const slide = track?.querySelector('.project-carousel__slide') as HTMLElement | null;
    const gap = track ? Number.parseFloat(getComputedStyle(track).columnGap || getComputedStyle(track).gap) || 24 : 24;
    return slide ? slide.offsetWidth + gap : 360;
  }

  private wrap(value: number): number {
    if (this.loopWidth <= 0) {
      return 0;
    }

    let next = value % this.loopWidth;
    if (next < 0) {
      next += this.loopWidth;
    }
    return next;
  }

  private applyTransform(): void {
    const track = this.trackRef()?.nativeElement;
    if (!track) {
      return;
    }

    track.style.transform = `translate3d(${-this.offset}px, 0, 0)`;
  }
}
