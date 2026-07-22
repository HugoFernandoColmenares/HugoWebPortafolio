import { Injectable, inject } from '@angular/core';
import { ChangePasswordInput, ProfileUpdateInput } from '../models/profile-form.model';
import { AuthService } from './auth.service';
import { SupabaseService } from './supabase.service';

@Injectable({ providedIn: 'root' })
export class UserProfileService {
  private readonly supabase = inject(SupabaseService);
  private readonly auth = inject(AuthService);

  async updateProfile(input: ProfileUpdateInput): Promise<void> {
    const authUserId = this.auth.session()?.user.id;
    if (!authUserId) {
      throw new Error('NOT_AUTHENTICATED');
    }

    const { error } = await this.supabase.client
      .from('users')
      .update({ full_name: input.fullName.trim() })
      .eq('auth_user_id', authUserId)
      .is('deleted_at', null);

    if (error) {
      throw error;
    }

    await this.auth.refreshProfile();
  }

  async changePassword(input: ChangePasswordInput): Promise<void> {
    const email = this.auth.session()?.user.email;
    if (!email) {
      throw new Error('NOT_AUTHENTICATED');
    }

    const { error: verifyError } = await this.supabase.client.auth.signInWithPassword({
      email,
      password: input.currentPassword,
    });

    if (verifyError) {
      throw new Error('INVALID_CURRENT_PASSWORD');
    }

    const { error } = await this.supabase.client.auth.updateUser({
      password: input.newPassword,
    });

    if (error) {
      throw error;
    }
  }
}
