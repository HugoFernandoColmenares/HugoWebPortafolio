import { Component, ChangeDetectionStrategy, computed, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter } from 'rxjs';
import { AuthError } from '@supabase/supabase-js';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { RecoveryPasswordComponent } from './recovery-password/recovery-password.component';
import { AuthService } from '../core/services/auth.service';
import { TranslationService } from '../core/services/translation.service';
import {
  LoginCredentials,
  PasswordUpdateRequest,
  RegisterCredentials,
  RecoveryRequest,
} from '../core/models/auth-credentials.model';

type AuthView = 'login' | 'register' | 'recovery';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [RouterLink, LoginComponent, RegisterComponent, RecoveryPasswordComponent],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  readonly ts = inject(TranslationService);

  readonly loading = signal(false);
  readonly errorMessage = signal('');
  readonly successMessage = signal('');
  readonly activeView = signal<AuthView>('login');

  readonly recoveryMode = computed(() =>
    this.auth.isRecoveryMode() ? 'update' : 'request'
  );

  constructor() {
    this.syncActiveView(this.router.url);
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event) => this.syncActiveView(event.urlAfterRedirects));
  }

  readonly loginLabels = computed(() => ({
    title: this.ts.t()['auth_login_title'],
    subtitle: this.ts.t()['auth_login_subtitle'],
    email: this.ts.t()['auth_email'],
    password: this.ts.t()['auth_password'],
    submit: this.ts.t()['auth_login_submit'],
    noAccount: this.ts.t()['auth_no_account'],
    register: this.ts.t()['auth_go_register'],
    forgotPassword: this.ts.t()['auth_forgot_password'],
  }));

  readonly registerLabels = computed(() => ({
    title: this.ts.t()['auth_register_title'],
    subtitle: this.ts.t()['auth_register_subtitle'],
    fullName: this.ts.t()['auth_full_name'],
    email: this.ts.t()['auth_email'],
    password: this.ts.t()['auth_password'],
    confirmPassword: this.ts.t()['auth_confirm_password'],
    submit: this.ts.t()['auth_register_submit'],
    hasAccount: this.ts.t()['auth_has_account'],
    login: this.ts.t()['auth_go_login'],
    passwordMismatch: this.ts.t()['auth_password_mismatch'],
  }));

  readonly recoveryLabels = computed(() => ({
    requestTitle: this.ts.t()['auth_recovery_title'],
    requestSubtitle: this.ts.t()['auth_recovery_subtitle'],
    updateTitle: this.ts.t()['auth_update_password_title'],
    updateSubtitle: this.ts.t()['auth_update_password_subtitle'],
    email: this.ts.t()['auth_email'],
    password: this.ts.t()['auth_password'],
    confirmPassword: this.ts.t()['auth_confirm_password'],
    submitRequest: this.ts.t()['auth_recovery_submit'],
    submitUpdate: this.ts.t()['auth_update_password_submit'],
    backToLogin: this.ts.t()['auth_back_login'],
    passwordMismatch: this.ts.t()['auth_password_mismatch'],
  }));

  async onLogin(credentials: LoginCredentials): Promise<void> {
    await this.runAuthAction(() => this.auth.signIn(credentials), '/');
  }

  async onRegister(credentials: RegisterCredentials): Promise<void> {
    this.resetMessages();

    try {
      this.loading.set(true);
      const result = await this.auth.signUp(credentials);

      if (result.requiresEmailConfirmation) {
        this.successMessage.set(this.ts.t()['auth_register_confirm_email']);
        return;
      }

      await this.router.navigateByUrl('/');
    } catch (error) {
      this.errorMessage.set(this.resolveErrorMessage(error));
    } finally {
      this.loading.set(false);
    }
  }

  async onRecovery(request: RecoveryRequest): Promise<void> {
    await this.runAuthAction(
      () => this.auth.requestPasswordReset(request.email),
      null,
      this.ts.t()['auth_recovery_email_sent'],
    );
  }

  async onPasswordUpdate(request: PasswordUpdateRequest): Promise<void> {
    if (request.password !== request.confirmPassword) {
      this.errorMessage.set(this.ts.t()['auth_password_mismatch']);
      return;
    }

    await this.runAuthAction(
      () => this.auth.updatePassword(request.password),
      '/auth/login',
      this.ts.t()['auth_password_updated'],
    );
  }

  goToLogin(): void {
    void this.router.navigate(['/auth/login']);
  }

  goToRegister(): void {
    void this.router.navigate(['/auth/register']);
  }

  goToRecovery(): void {
    void this.router.navigate(['/auth/recovery-password']);
  }

  private syncActiveView(url: string): void {
    if (url.includes('/auth/register')) {
      this.activeView.set('register');
      return;
    }

    if (url.includes('/auth/recovery-password')) {
      this.activeView.set('recovery');
      return;
    }

    this.activeView.set('login');
  }

  private async runAuthAction(
    action: () => Promise<void>,
    redirectTo: string | null,
    successMsg = '',
  ): Promise<void> {
    this.resetMessages();

    try {
      this.loading.set(true);
      await action();

      if (successMsg) {
        this.successMessage.set(successMsg);
      }

      if (redirectTo) {
        await this.router.navigateByUrl(redirectTo);
      }
    } catch (error) {
      this.errorMessage.set(this.resolveErrorMessage(error));
    } finally {
      this.loading.set(false);
    }
  }

  private resetMessages(): void {
    this.errorMessage.set('');
    this.successMessage.set('');
  }

  private resolveErrorMessage(error: unknown): string {
    if (error instanceof AuthError) {
      return error.message;
    }

    if (error instanceof Error) {
      return error.message;
    }

    return this.ts.t()['auth_generic_error'];
  }
}
