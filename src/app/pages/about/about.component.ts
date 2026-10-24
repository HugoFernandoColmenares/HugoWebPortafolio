import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SITE } from '../../core/config/site';
import { AboutStackGroup, TimelineEntry } from '../../core/models/about.model';
import { TranslationService } from '../../core/services/translation.service';
import { IconComponent } from '../../shared/icons/icon.component';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [RouterLink, NgOptimizedImage, IconComponent],
  templateUrl: './about.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './about.component.css',
})
export class AboutComponent {
  readonly ts = inject(TranslationService);
  readonly site = SITE;

  /** From the CV; keep in sync with it rather than inventing roles. */
  readonly timeline: TimelineEntry[] = [
    { when: '2024 —', whenKey: 'tl_now', title: 'tl_freelance', org: 'tl_freelance_org' },
    { when: '2022 — 2025', title: 'tl_cic', org: 'tl_cic_org' },
    { when: '', whenKey: 'tl_in_progress', title: 'tl_adso', org: 'tl_sena_org' },
    { when: '2022', title: 'tl_sena', org: 'tl_sena_org' },
    { when: '2019', title: 'tl_social', org: 'tl_social_org' },
  ];

  readonly stack: AboutStackGroup[] = [
    { title: 'about_skill_frontend', items: ['Angular 14–22', 'TypeScript', 'RxJS', 'Signals', 'HTML / CSS', 'PrimeNG'] },
    { title: 'about_skill_backend', items: ['C#', 'ASP.NET Core', 'Entity Framework Core', 'NestJS / Node.js', 'Python (FastAPI, Flask)'] },
    { title: 'about_skill_database', items: ['SQL Server', 'PostgreSQL', 'MySQL', 'SQLite', 'Supabase'] },
    { title: 'about_skill_devops', items: ['Git / GitHub', 'GitHub Actions', 'Docker / Compose', 'Linux (Ubuntu Server)', 'Vercel', 'Railway'] },
  ];
}
