import { Role, RoleRow } from './role.model';

export interface UserProfile {
  id: string;
  authUserId: string;
  roleId: string;
  email: string;
  fullName: string;
  role?: Role;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface UserProfileRow {
  id: string;
  auth_user_id: string;
  role_id: string;
  email: string;
  full_name: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  role?: RoleRow | RoleRow[] | null;
}

export interface UserProfileWithRoleRow extends UserProfileRow {
  role: RoleRow | null;
}
