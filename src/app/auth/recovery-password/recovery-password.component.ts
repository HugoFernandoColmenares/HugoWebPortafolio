import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthFacadeService } from '../../core/services/auth-facade.service';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-recovery-password',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './recovery-password.component.html',
  styleUrl: './recovery-password.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecoveryPasswordComponent {
  readonly facade = inject(AuthFacadeService);
  private readonly fb = inject(FormBuilder);
  private readonly notifications = inject(NotificationService);

  readonly showPassword = signal(false);
  readonly showConfirmPassword = signal(false);

  readonly requestForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
  });

  readonly updateForm = this.fb.nonNullable.group({
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required]],
  });

  get rf() {
    return this.requestForm.controls;
  }

  get uf() {
    return this.updateForm.controls;
  }

  togglePassword(): void {
    this.showPassword.update(value => !value);
  }

  toggleConfirmPassword(): void {
    this.showConfirmPassword.update(value => !value);
  }

  onRequestSubmit(): void {
    if (this.requestForm.invalid) {
      this.requestForm.markAllAsTouched();
      return;
    }

    void this.facade.onRecovery(this.requestForm.getRawValue());
  }

  onUpdateSubmit(): void {
    if (this.updateForm.invalid) {
      this.updateForm.markAllAsTouched();
      return;
    }

    const { password, confirmPassword } = this.updateForm.getRawValue();
    if (password !== confirmPassword) {
      void this.notifications.error(this.facade.recoveryLabels().passwordMismatch);
      return;
    }

    void this.facade.onPasswordUpdate({ password, confirmPassword });
  }
}
