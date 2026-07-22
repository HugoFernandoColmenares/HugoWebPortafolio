import { Component, ChangeDetectionStrategy, computed, inject, signal, viewChild } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../core/services/notification.service';
import { TranslationService } from '../../core/services/translation.service';
import { UserProfileService } from '../../core/services/user-profile.service';
import {
  ChangePasswordInput,
  ProfileFormLabels,
  ProfileUpdateInput,
} from '../../core/models/profile-form.model';
import { ProfileFormComponent } from './form/form.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [ProfileFormComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent {
  readonly ts = inject(TranslationService);
  private readonly auth = inject(AuthService);
  private readonly profileService = inject(UserProfileService);
  private readonly notifications = inject(NotificationService);

  readonly profile = this.auth.profile;
  readonly session = this.auth.session;

  readonly savingProfile = signal(false);
  readonly savingPassword = signal(false);

  private readonly profileForm = viewChild(ProfileFormComponent);

  readonly isLoading = computed(() => {
    return this.auth.isAuthenticated() && this.profile() === null;
  });

  readonly formLabels = computed<ProfileFormLabels>(() => {
    const t = this.ts.t();
    return {
      profileSectionTitle: t.admin_profile_form_profile_section,
      passwordSectionTitle: t.admin_profile_form_password_section,
      fullName: t.admin_profile_full_name,
      email: t.admin_profile_email,
      role: t.admin_profile_role,
      memberSince: t.admin_profile_member_since,
      currentPassword: t.admin_profile_form_current_password,
      newPassword: t.admin_profile_form_new_password,
      confirmPassword: t.admin_profile_form_confirm_password,
      saveProfile: t.admin_profile_form_save,
      changePassword: t.admin_profile_form_change_password,
      passwordHint: t.admin_profile_form_password_hint,
      editProfileAction: t.admin_profile_form_edit_action,
      changePasswordAction: t.admin_profile_form_change_password_action,
      cancelAction: t.admin_profile_form_cancel,
    };
  });

  async onSaveProfile(input: ProfileUpdateInput): Promise<void> {
    const t = this.ts.t();

    try {
      this.savingProfile.set(true);
      await this.profileService.updateProfile(input);
      this.profileForm()?.showSummary();
      void this.notifications.success(t.admin_profile_save_success);
    } catch {
      void this.notifications.error(t.admin_profile_save_error);
    } finally {
      this.savingProfile.set(false);
    }
  }

  async onChangePassword(input: ChangePasswordInput): Promise<void> {
    const t = this.ts.t();

    if (input.newPassword !== input.confirmPassword) {
      void this.notifications.error(t.admin_profile_password_mismatch);
      return;
    }

    if (input.newPassword === input.currentPassword) {
      void this.notifications.error(t.admin_profile_password_same_as_current);
      return;
    }

    try {
      this.savingPassword.set(true);
      await this.profileService.changePassword(input);
      this.profileForm()?.resetPasswordForm();
      this.profileForm()?.showSummary();
      void this.notifications.success(t.admin_profile_password_success);
    } catch (error) {
      const message =
        error instanceof Error && error.message === 'INVALID_CURRENT_PASSWORD'
          ? t.admin_profile_password_invalid_current
          : t.admin_profile_password_error;
      void this.notifications.error(message);
    } finally {
      this.savingPassword.set(false);
    }
  }
}
