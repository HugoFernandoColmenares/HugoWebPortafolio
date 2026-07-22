import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { SocialMediaContext, SocialMediaLink } from '../../../core/models/social-media.model';

@Component({
  selector: 'app-social-links',
  standalone: true,
  templateUrl: './social-links.component.html',
  styleUrl: './social-links.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SocialLinksComponent {
  readonly links = input.required<SocialMediaLink[]>();
  readonly context = input.required<SocialMediaContext>();

  isImageIcon(icon?: string): boolean {
    return !!icon && /^https?:\/\//i.test(icon);
  }

  isClassIcon(icon?: string): boolean {
    return !!icon && !this.isImageIcon(icon);
  }
}
