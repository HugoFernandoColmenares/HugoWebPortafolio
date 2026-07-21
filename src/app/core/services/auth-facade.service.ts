import { Injectable, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthError } from '@supabase/supabase-js';
import { AuthService } from './auth.service';
import { TranslationService } from './translation.service';
import { ConfirmRegisterStatus, LoginCredentials, PasswordUpdateRequest, RegisterCredentials, RecoveryRequest, } from '../models/auth-credentials.model';

@Injectable()
export class AuthFacadeService {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly ts = inject(TranslationService);

  readonly loading = signal(false);
  readonly errorMessage = signal('');
  readonly successMessage = signal('');
  readonly confirmStatus = signal<ConfirmRegisterStatus>('loading');

  private confirmationHandled = false;

  readonly recoveryMode = computed(() =>
    this.auth.isRecoveryMode() ? 'update' as const : 'request' as const,
  );

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

  readonly confirmLabels = computed(() => ({
    loadingTitle: this.ts.t()['auth_confirm_loading_title'],
    loadingSubtitle: this.ts.t()['auth_confirm_loading_subtitle'],
    successTitle: this.ts.t()['auth_confirm_success_title'],
    successSubtitle: this.ts.t()['auth_confirm_success_subtitle'],
    errorTitle: this.ts.t()['auth_confirm_error_title'],
    errorSubtitle: this.ts.t()['auth_confirm_error_subtitle'],
    invalidTitle: this.ts.t()['auth_confirm_invalid_title'],
    invalidSubtitle: this.ts.t()['auth_confirm_invalid_subtitle'],
    goToLogin: this.ts.t()['auth_go_login'],
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

  async handleEmailConfirmation(): Promise<void> {
    if (this.confirmationHandled) {
      return;
    }

    this.confirmationHandled = true;
    this.confirmStatus.set('loading');
    const status = await this.auth.confirmEmailRegistration();
    this.confirmStatus.set(status);
  }

  goToLogin(): void {
    this.confirmationHandled = false;
    void this.router.navigate(['/auth/login']);
  }

  goToRegister(): void {
    void this.router.navigate(['/auth/register']);
  }

  goToRecovery(): void {
    void this.router.navigate(['/auth/recovery-password']);
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
