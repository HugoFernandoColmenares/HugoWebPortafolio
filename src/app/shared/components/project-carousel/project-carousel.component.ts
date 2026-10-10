import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  Injector,
  input,
  signal,
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
  readonly title = input.required<string>();
  readonly projects = input.required<PortfolioProject[]>();
  readonly ts = inject(TranslationService);

  private static nextId = 0;
  readonly titleId = `carousel-title-${++ProjectCarouselComponent.nextId}`;

  private readonly injector = inject(Injector);
  private readonly trackRef = viewChild<ElementRef<HTMLElement>>('track');

  readonly canScrollPrev = signal(false);
  readonly canScrollNext = signal(false);

  constructor() {
    afterNextRender(() => this.syncScrollState(), { injector: this.injector });
  }

  scroll(direction: -1 | 1): void {
    const track = this.trackRef()?.nativeElement;
    if (!track) {
      return;
    }

    track.scrollBy({ left: direction * this.slideStep(track), behavior: 'smooth' });
    this.queueSync();
  }

  onTrackKeydown(event: KeyboardEvent): void {
    const track = this.trackRef()?.nativeElement;
    if (!track) {
      return;
    }

    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      this.scroll(-1);
      return;
    }

    if (event.key === 'ArrowRight') {
      event.preventDefault();
      this.scroll(1);
      return;
    }

    if (event.key === 'Home') {
      event.preventDefault();
      track.scrollTo({ left: 0, behavior: 'smooth' });
      this.queueSync();
      return;
    }

    if (event.key === 'End') {
      event.preventDefault();
      track.scrollTo({ left: track.scrollWidth, behavior: 'smooth' });
      this.queueSync();
    }
  }

  syncScrollState(): void {
    const track = this.trackRef()?.nativeElement;
    if (!track) {
      this.canScrollPrev.set(false);
      this.canScrollNext.set(false);
      return;
    }

    const maxScroll = track.scrollWidth - track.clientWidth;
    const left = track.scrollLeft;
    this.canScrollPrev.set(left > 4);
    this.canScrollNext.set(maxScroll - left > 4);
  }

  private slideStep(track: HTMLElement): number {
    const slide = track.querySelector('.project-carousel__slide') as HTMLElement | null;
    const styles = getComputedStyle(track);
    const gap = Number.parseFloat(styles.columnGap || styles.gap) || 24;
    return slide ? slide.offsetWidth + gap : 360;
  }

  private queueSync(): void {
    requestAnimationFrame(() => this.syncScrollState());
  }
}
