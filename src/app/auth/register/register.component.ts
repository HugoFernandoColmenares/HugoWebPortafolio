import { Component, ChangeDetectionStrategy, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RegisterCredentials } from '../../core/models/auth-credentials.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterComponent {
  @Input({ required: true }) loading = false;
  @Input() errorMessage = '';
  @Input() successMessage = '';
  @Input({ required: true }) labels!: {
    title: string;
    subtitle: string;
    fullName: string;
    email: string;
    password: string;
    confirmPassword: string;
    submit: string;
    hasAccount: string;
    login: string;
    passwordMismatch: string;
  };

  @Output() submitRegister = new EventEmitter<RegisterCredentials>();
  @Output() goToLogin = new EventEmitter<void>();

  showPasswordMismatch = false;
  private readonly fb = new FormBuilder();

  readonly form = this.fb.nonNullable.group({
    fullName: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required]],
  });

  get f() {
    return this.form.controls;
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { fullName, email, password, confirmPassword } = this.form.getRawValue();

    if (password !== confirmPassword) {
      this.showPasswordMismatch = true;
      return;
    }

    this.showPasswordMismatch = false;
    this.submitRegister.emit({ fullName, email, password });
  }
}
