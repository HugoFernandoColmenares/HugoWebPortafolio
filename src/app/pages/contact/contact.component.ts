import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { SITE } from '../../core/config/site';
import { SocialMediaLink } from '../../core/models/social-media.model';
import { ContactService } from '../../core/services/contact.service';
import { SocialMediaService } from '../../core/services/social-media.service';
import { NotificationService } from '../../core/services/notification.service';
import { TranslationService } from '../../core/services/translation.service';
import { IconComponent } from '../../shared/icons/icon.component';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [ReactiveFormsModule, IconComponent],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactComponent implements OnInit {
  readonly ts = inject(TranslationService);
  private readonly contactService = inject(ContactService);
  private readonly notifications = inject(NotificationService);
  private readonly fb = inject(FormBuilder);
  private readonly socialMedia = inject(SocialMediaService);

  /** Links managed from the admin panel (falls back to GitHub + LinkedIn). */
  readonly links = signal<Pick<SocialMediaLink, 'name' | 'url' | 'platform'>[]>([
    { name: 'LinkedIn', url: SITE.linkedinUrl, platform: 'linkedin' },
    { name: 'GitHub', url: SITE.githubUrl, platform: 'github' },
  ]);

  ngOnInit(): void {
    this.socialMedia
      .getPublicLinks('about')
      .then(links => {
        if (links.length) {
          this.links.set(links);
        }
      })
      .catch(() => undefined);
  }

  iconFor(platform: string): 'github' | 'linkedin' | 'external' {
    return platform === 'github' || platform === 'linkedin' ? platform : 'external';
  }

  readonly site = SITE;
  readonly sending = signal(false);
  readonly copied = signal(false);

  readonly contactForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    message: ['', [Validators.required, Validators.minLength(10)]],
    // Honeypot: hidden from people, bots tend to fill it.
    website: [''],
  });

  get f() {
    return this.contactForm.controls;
  }

  async copyEmail(): Promise<void> {
    try {
      await navigator.clipboard.writeText(this.site.email);
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 2500);
    } catch {
      window.location.href = `mailto:${this.site.email}`;
    }
  }

  async onSubmit(): Promise<void> {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }

    const { name, email, message, website } = this.contactForm.getRawValue();
    if (website) {
      // Silently accept bot submissions without storing them.
      this.contactForm.reset();
      return;
    }

    this.sending.set(true);
    try {
      await this.contactService.sendMessage({ name: name!, email: email!, message: message! });
      void this.notifications.success(this.ts.t().about_contact_success);
      this.contactForm.reset();
    } catch {
      void this.notifications.error(this.ts.t().about_contact_error);
    } finally {
      this.sending.set(false);
    }
  }
}
