import { DatePipe } from '@angular/common';
import { Component, ChangeDetectionStrategy, computed, inject } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { TranslationService } from '../../core/services/translation.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent {
  readonly ts = inject(TranslationService);
  private readonly auth = inject(AuthService);

  readonly profile = this.auth.profile;
  readonly session = this.auth.session;

  readonly isLoading = computed(() => {
    return this.auth.isAuthenticated() && this.profile() === null;
  });

  readonly initials = computed(() => {
    const name = this.profile()?.fullName?.trim();
    if (!name) {
      return '?';
    }

    return name
      .split(/\s+/)
      .slice(0, 2)
      .map(part => part.charAt(0).toUpperCase())
      .join('');
  });
}
