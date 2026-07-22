import { Component, inject, OnInit, signal, ChangeDetectionStrategy } from '@angular/core';

import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { SocialMediaLink } from '../../core/models/social-media.model';
import { TranslationService } from '../../core/services/translation.service';
import { ContactService } from '../../core/services/contact.service';
import { NotificationService } from '../../core/services/notification.service';
import { SocialMediaService } from '../../core/services/social-media.service';
import { TechBadgeComponent } from '../../shared/components/tech-badge/tech-badge.component';
import { SocialLinksComponent } from '../../shared/components/social-links/social-links.component';
import { Skill } from '../../core/models/skill.model';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [ReactiveFormsModule, TechBadgeComponent, SocialLinksComponent],
  templateUrl: './about.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './about.component.css'
})
export class AboutComponent implements OnInit {
  readonly ts = inject(TranslationService);
  private readonly contactService = inject(ContactService);
  private readonly notifications = inject(NotificationService);
  private readonly socialMediaService = inject(SocialMediaService);
  private readonly fb = inject(FormBuilder);

  readonly socialLinks = signal<SocialMediaLink[]>([]);

  readonly skills: Skill[] = [
    { name: 'Angular', level: 90, category: 'frontend' },
    { name: 'TypeScript', level: 88, category: 'frontend' },
    { name: 'HTML', level: 92, category: 'frontend' },
    { name: 'CSS', level: 85, category: 'frontend' },
    { name: '.NET Core', level: 85, category: 'backend' },
    { name: 'C#', level: 83, category: 'backend' },
    { name: 'Entity Framework', level: 78, category: 'backend' },
    { name: 'Node.js', level: 65, category: 'backend' },
    { name: 'SQL Server', level: 80, category: 'database' },
    { name: 'PostgreSQL', level: 70, category: 'database' },
    { name: 'Docker', level: 60, category: 'devops' },
    { name: 'Git', level: 88, category: 'devops' },
    { name: 'Azure', level: 55, category: 'devops' },
  ];

  readonly techNames = this.skills.map(s => s.name);

  contactForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    message: ['', [Validators.required, Validators.minLength(10)]],
  });

  sending = false;

  ngOnInit(): void {
    void this.loadSocialLinks();
  }

  get f() { return this.contactForm.controls; }

  async onSubmit(): Promise<void> {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }

    this.sending = true;

    const { name, email, message } = this.contactForm.getRawValue();

    try {
      await this.contactService.sendMessage({
        name: name!,
        email: email!,
        message: message!,
      });
      void this.notifications.success(this.ts.t()['about_contact_success']);
      this.contactForm.reset();
    } catch {
      void this.notifications.error(this.ts.t()['about_contact_error']);
    } finally {
      this.sending = false;
    }
  }

  private async loadSocialLinks(): Promise<void> {
    try {
      this.socialLinks.set(await this.socialMediaService.getPublicLinks('about'));
    } catch {
      this.socialLinks.set([]);
    }
  }
}
