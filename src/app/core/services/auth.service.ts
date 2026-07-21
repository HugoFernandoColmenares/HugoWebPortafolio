import { Injectable, computed, inject, signal } from '@angular/core';
import { Session } from '@supabase/supabase-js';
import { AuthResult, ConfirmRegisterStatus, LoginCredentials, RegisterCredentials, } from '../models/auth-credentials.model';
import { UserProfile } from '../models/user.model';
import { mapUserProfile } from '../mappers/user.mapper';
import { SupabaseService } from './supabase.service';
import { appEnvironment } from '../config/app-environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly supabase = inject(SupabaseService);

  readonly session = signal<Session | null>(null);
  readonly profile = signal<UserProfile | null>(null);
  readonly isAuthenticated = computed(() => this.session() !== null);
  readonly isRecoveryMode = signal(false);

  private readonly initPromise: Promise<void>;

  constructor() {
    this.initPromise = this.initialize();
  }

  whenReady(): Promise<void> {
    return this.initPromise;
  }

  async initialize(): Promise<void> {
    const { data: { session } } = await this.supabase.client.auth.getSession();
    this.session.set(session);

    if (session) {
      await this.loadProfile();
    }

    this.supabase.client.auth.onAuthStateChange(async (event, nextSession) => {
      this.session.set(nextSession);

      if (event === 'PASSWORD_RECOVERY') {
        this.isRecoveryMode.set(true);
      }

      if (nextSession) {
        await this.loadProfile();
        return;
      }

      this.profile.set(null);
      this.isRecoveryMode.set(false);
    });
  }

  async signIn(credentials: LoginCredentials): Promise<void> {
    const { error } = await this.supabase.client.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    });

    if (error) {
      throw error;
    }
  }

  async signUp(credentials: RegisterCredentials): Promise<AuthResult> {
    const { data, error } = await this.supabase.client.auth.signUp({
      email: credentials.email,
      password: credentials.password,
      options: {
        data: { full_name: credentials.fullName },
        emailRedirectTo: `${appEnvironment.siteUrl}/#/auth/confirm-register`,
      },
    });

    if (error) {
      throw error;
    }

    return {
      requiresEmailConfirmation: !data.session,
    };
  }

  async signOut(): Promise<void> {
    const { error } = await this.supabase.client.auth.signOut();
    if (error) {
      throw error;
    }
  }

  async requestPasswordReset(email: string): Promise<void> {
    const redirectTo = `${appEnvironment.siteUrl}/#/auth/recovery-password`;
    const { error } = await this.supabase.client.auth.resetPasswordForEmail(email, {
      redirectTo,
    });

    if (error) {
      throw error;
    }
  }

  async updatePassword(password: string): Promise<void> {
    const { error } = await this.supabase.client.auth.updateUser({ password });
    if (error) {
      throw error;
    }

    this.isRecoveryMode.set(false);
  }

  async confirmEmailRegistration(): Promise<ConfirmRegisterStatus> {
    const queryParams = new URLSearchParams(window.location.search);
    const code = queryParams.get('code');

    if (code) {
      const { error } = await this.supabase.client.auth.exchangeCodeForSession(code);
      if (error) {
        return 'error';
      }
    }

    const hash = window.location.hash;
    const hasAuthParams =
      hash.includes('access_token=') ||
      hash.includes('type=signup') ||
      hash.includes('type=email');

    if (hasAuthParams) {
      const authFragment = hash.includes('access_token=')
        ? hash.slice(hash.indexOf('access_token='))
        : '';

      if (authFragment) {
        const params = new URLSearchParams(authFragment.replace(/#/g, '&'));
        const accessToken = params.get('access_token');
        const refreshToken = params.get('refresh_token');

        if (accessToken && refreshToken) {
          const { error } = await this.supabase.client.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (error) {
            return 'error';
          }
        }
      }
    }

    const { data: { session }, error: sessionError } = await this.supabase.client.auth.getSession();

    if (sessionError) {
      return 'error';
    }

    if (!session) {
      return hasAuthParams || code ? 'error' : 'invalid';
    }

    await this.loadProfile();
    await this.signOut();
    return 'success';
  }

  private async loadProfile(): Promise<void> {
    const authUserId = this.session()?.user.id;
    if (!authUserId) {
      return;
    }

    const { data, error } = await this.supabase.client
      .from('users')
      .select('*, role:roles(*)')
      .eq('auth_user_id', authUserId)
      .is('deleted_at', null)
      .maybeSingle();

    if (error) {
      throw error;
    }

    this.profile.set(data ? mapUserProfile(data) : null);
  }
}
