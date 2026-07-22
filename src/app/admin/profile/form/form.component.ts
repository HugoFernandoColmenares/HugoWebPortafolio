import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { Button } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { Password } from 'primeng/password';
import {
  ChangePasswordInput,
  ProfileFormLabels,
  ProfilePanelView,
  ProfileUpdateInput,
} from '../../../core/models/profile-form.model';
import { UserProfile } from '../../../core/models/user.model';

@Component({
  selector: 'app-profile-form',
  standalone: true,
  imports: [ReactiveFormsModule, InputText, Password, Button, DatePipe],
  templateUrl: './form.component.html',
  styleUrl: './form.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileFormComponent {
  readonly profile = input.required<UserProfile>();
  readonly labels = input.required<ProfileFormLabels>();
  readonly savingProfile = input(false);
  readonly savingPassword = input(false);

  readonly saveProfile = output<ProfileUpdateInput>();
  readonly changePassword = output<ChangePasswordInput>();

  private readonly fb = inject(FormBuilder);

  readonly activeView = signal<ProfilePanelView>('summary');

  readonly profileForm = this.fb.nonNullable.group({
    fullName: ['', [Validators.required, Validators.minLength(2)]],
  });

  readonly passwordForm = this.fb.nonNullable.group({
    currentPassword: ['', [Validators.required]],
    newPassword: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required]],
  });

  constructor() {
    effect(() => {
      const user = this.profile();
      this.profileForm.reset({
        fullName: user.fullName,
      });
    });
  }

  showSummary(): void {
    this.activeView.set('summary');
  }

  showEditProfile(): void {
    this.activeView.set('edit-profile');
  }

  showChangePassword(): void {
    this.activeView.set('change-password');
  }

  onProfileSubmit(): void {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    this.saveProfile.emit(this.profileForm.getRawValue());
  }

  onPasswordSubmit(): void {
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      return;
    }

    this.changePassword.emit(this.passwordForm.getRawValue());
  }

  resetPasswordForm(): void {
    this.passwordForm.reset({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
  }
}
