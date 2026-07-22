import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthFacadeService } from '../../core/services/auth-facade.service';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterComponent {
  readonly facade = inject(AuthFacadeService);
  private readonly fb = inject(FormBuilder);
  private readonly notifications = inject(NotificationService);

  readonly showPassword = signal(false);
  readonly showConfirmPassword = signal(false);

  readonly form = this.fb.nonNullable.group({
    fullName: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required]],
  });

  get f() {
    return this.form.controls;
  }

  togglePassword(): void {
    this.showPassword.update(value => !value);
  }

  toggleConfirmPassword(): void {
    this.showConfirmPassword.update(value => !value);
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { fullName, email, password, confirmPassword } = this.form.getRawValue();

    if (password !== confirmPassword) {
      void this.notifications.error(this.facade.registerLabels().passwordMismatch);
      return;
    }

    void this.facade.onRegister({ fullName, email, password });
  }
}
