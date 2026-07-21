import { Component, ChangeDetectionStrategy, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoginCredentials } from '../../core/models/auth-credentials.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  @Input({ required: true }) loading = false;
  @Input() errorMessage = '';
  @Input({ required: true }) labels!: {
    title: string;
    subtitle: string;
    email: string;
    password: string;
    submit: string;
    noAccount: string;
    register: string;
    forgotPassword: string;
  };

  @Output() submitLogin = new EventEmitter<LoginCredentials>();
  @Output() goToRegister = new EventEmitter<void>();
  @Output() goToRecovery = new EventEmitter<void>();

  private readonly fb = new FormBuilder();

  readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  get f() {
    return this.form.controls;
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitLogin.emit(this.form.getRawValue());
  }
}
