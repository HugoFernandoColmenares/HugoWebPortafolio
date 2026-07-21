import { Role, RoleRow } from '../models/role.model';
import { UserProfile, UserProfileWithRoleRow } from '../models/user.model';

export function mapRole(row: RoleRow): Role {
  return {
    id: row.id,
    name: row.name,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    deletedAt: row.deleted_at,
  };
}

export function mapUserProfile(row: UserProfileWithRoleRow): UserProfile {
  const roleData = Array.isArray(row.role) ? row.role[0] : row.role;

  return {
    id: row.id,
    authUserId: row.auth_user_id,
    roleId: row.role_id,
    email: row.email,
    fullName: row.full_name,
    role: roleData ? mapRole(roleData) : undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    deletedAt: row.deleted_at,
  };
}
