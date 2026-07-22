import { Injectable, inject } from '@angular/core';
import { mapRole, mapUserProfile } from '../mappers/user.mapper';
import { AdminUserInput, AdminUserUpdateInput } from '../models/admin-user.model';
import { Role, RoleRow } from '../models/role.model';
import { UserProfile, UserProfileWithRoleRow } from '../models/user.model';
import { AuthService } from './auth.service';
import { SupabaseService } from './supabase.service';

@Injectable({ providedIn: 'root' })
export class AdminUserService {
  private readonly supabase = inject(SupabaseService);
  private readonly auth = inject(AuthService);

  async getAll(): Promise<UserProfile[]> {
    this.ensureAdmin();

    const { data, error } = await this.supabase.client
      .from('users')
      .select('*, role:roles(*)')
      .is('deleted_at', null)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return (data as UserProfileWithRoleRow[]).map(mapUserProfile);
  }

  async getRoles(): Promise<Role[]> {
    this.ensureAdmin();

    const { data, error } = await this.supabase.client
      .from('roles')
      .select('*')
      .is('deleted_at', null)
      .order('name', { ascending: true });

    if (error) {
      throw error;
    }

    return (data as RoleRow[]).map(mapRole);
  }

  async createUser(input: AdminUserInput): Promise<void> {
    this.ensureAdmin();

    const sessionBackup = await this.supabase.client.auth.getSession();
    const { error: signUpError } = await this.supabase.client.auth.signUp({
      email: input.email.trim(),
      password: input.password,
      options: {
        data: { full_name: input.fullName.trim() },
      },
    });

    if (signUpError) {
      throw signUpError;
    }

    if (sessionBackup.data.session) {
      await this.supabase.client.auth.setSession({
        access_token: sessionBackup.data.session.access_token,
        refresh_token: sessionBackup.data.session.refresh_token,
      });
    }

    const { data: createdUser, error: lookupError } = await this.supabase.client
      .from('users')
      .select('id')
      .eq('email', input.email.trim())
      .is('deleted_at', null)
      .maybeSingle();

    if (lookupError) {
      throw lookupError;
    }

    if (createdUser) {
      const { error: roleError } = await this.supabase.client
        .from('users')
        .update({ role_id: input.roleId })
        .eq('id', createdUser.id);

      if (roleError) {
        throw roleError;
      }
    }
  }

  async updateUser(userId: string, input: AdminUserUpdateInput): Promise<void> {
    this.ensureAdmin();

    const { error } = await this.supabase.client
      .from('users')
      .update({
        full_name: input.fullName.trim(),
        email: input.email.trim(),
        role_id: input.roleId,
      })
      .eq('id', userId)
      .is('deleted_at', null);

    if (error) {
      throw error;
    }
  }

  async softDelete(userId: string): Promise<void> {
    this.ensureAdmin();

    const currentUserId = this.auth.profile()?.id;
    if (currentUserId === userId) {
      throw new Error('CANNOT_DELETE_SELF');
    }

    const { error } = await this.supabase.client
      .from('users')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', userId)
      .is('deleted_at', null);

    if (error) {
      throw error;
    }
  }

  private ensureAdmin(): void {
    if (!this.auth.isAdmin()) {
      throw new Error('FORBIDDEN');
    }
  }
}
