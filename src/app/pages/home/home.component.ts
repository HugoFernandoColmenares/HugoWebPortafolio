import { Component, HostListener, inject, OnInit, signal, ChangeDetectionStrategy } from '@angular/core';

import { RouterLink } from '@angular/router';
import { SocialMediaLink } from '../../core/models/social-media.model';
import { SocialMediaService } from '../../core/services/social-media.service';
import { TranslationService } from '../../core/services/translation.service';
import { SocialLinksComponent } from '../../shared/components/social-links/social-links.component';

interface HeroChip {
  label: string;
  variant: 'angular' | 'dotnet' | 'typescript' | 'sql';
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, SocialLinksComponent],
  templateUrl: './home.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  readonly ts = inject(TranslationService);
  private readonly socialMediaService = inject(SocialMediaService);

  readonly socialLinks = signal<SocialMediaLink[]>([]);

  readonly heroChips: HeroChip[] = [
    { label: 'Angular', variant: 'angular' },
    { label: '.NET Core', variant: 'dotnet' },
    { label: 'TypeScript', variant: 'typescript' },
    { label: 'SQL Server', variant: 'sql' },
  ];

  ngOnInit(): void {
    void this.loadSocialLinks();
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    const { clientX, clientY } = event;
    const { innerWidth, innerHeight } = window;

    const x = ((clientX / innerWidth) * 100).toFixed(2);
    const y = ((clientY / innerHeight) * 100).toFixed(2);

    document.documentElement.style.setProperty('--mouse-x', `${x}%`);
    document.documentElement.style.setProperty('--mouse-y', `${y}%`);
  }

  private async loadSocialLinks(): Promise<void> {
    try {
      this.socialLinks.set(await this.socialMediaService.getPublicLinks('hero'));
    } catch {
      this.socialLinks.set([]);
    }
  }
}
