export type RoleName = 'ADMIN' | 'MODERATOR' | 'USER';

export interface Role {
  id: string;
  name: RoleName;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface RoleRow {
  id: string;
  name: RoleName;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}
