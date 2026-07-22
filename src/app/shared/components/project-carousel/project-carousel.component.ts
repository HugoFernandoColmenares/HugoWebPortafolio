import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  input,
  viewChild,
} from '@angular/core';
import { PortfolioProject } from '../../../core/models/portfolio-project.model';
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

  private readonly trackRef = viewChild<ElementRef<HTMLElement>>('track');

  scroll(direction: -1 | 1): void {
    const track = this.trackRef()?.nativeElement;
    if (!track) {
      return;
    }

    const slide = track.querySelector('.project-carousel__slide') as HTMLElement | null;
    const gap = 24;
    const amount = slide ? slide.offsetWidth + gap : 360;
    track.scrollBy({ left: direction * amount, behavior: 'smooth' });
  }
}
