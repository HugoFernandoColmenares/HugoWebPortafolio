import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthFacadeService } from '../../core/services/auth-facade.service';

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

  showPasswordMismatch = false;

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
      this.showPasswordMismatch = true;
      return;
    }

    this.showPasswordMismatch = false;
    void this.facade.onPasswordUpdate({ password, confirmPassword });
  }
}
