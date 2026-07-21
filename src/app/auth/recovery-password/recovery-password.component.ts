import { Component, ChangeDetectionStrategy, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { PasswordUpdateRequest, RecoveryRequest } from '../../core/models/auth-credentials.model';

export type RecoveryMode = 'request' | 'update';

@Component({
  selector: 'app-recovery-password',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './recovery-password.component.html',
  styleUrl: './recovery-password.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecoveryPasswordComponent {
  @Input({ required: true }) mode: RecoveryMode = 'request';
  @Input({ required: true }) loading = false;
  @Input() errorMessage = '';
  @Input() successMessage = '';
  @Input({ required: true }) labels!: {
    requestTitle: string;
    requestSubtitle: string;
    updateTitle: string;
    updateSubtitle: string;
    email: string;
    password: string;
    confirmPassword: string;
    submitRequest: string;
    submitUpdate: string;
    backToLogin: string;
    passwordMismatch: string;
  };

  @Output() submitRecovery = new EventEmitter<RecoveryRequest>();
  @Output() submitPasswordUpdate = new EventEmitter<PasswordUpdateRequest>();
  @Output() goToLogin = new EventEmitter<void>();

  showPasswordMismatch = false;
  private readonly fb = new FormBuilder();

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

    this.submitRecovery.emit(this.requestForm.getRawValue());
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
    this.submitPasswordUpdate.emit({ password, confirmPassword });
  }
}
