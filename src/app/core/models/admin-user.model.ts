import { RoleName } from './role.model';
import { UserProfile } from './user.model';

export type AdminPanelViewMode = 'list' | 'create' | 'edit' | 'view';

export interface RoleOption {
  label: string;
  value: string;
  name: RoleName;
}

export interface AdminUserInput {
  email: string;
  fullName: string;
  password: string;
  roleId: string;
}

export interface AdminUserUpdateInput {
  fullName: string;
  email: string;
  roleId: string;
}

export interface AdminUserTableLabels {
  title: string;
  subtitle: string;
  add: string;
  empty: string;
  filterSearch: string;
  filterRole: string;
  filterRolePlaceholder: string;
  filterEmailStatus: string;
  filterEmailStatusPlaceholder: string;
  emailConfirmed: string;
  emailPending: string;
  columnName: string;
  columnEmail: string;
  columnRole: string;
  columnEmailStatus: string;
  columnMemberSince: string;
  columnActions: string;
  view: string;
  edit: string;
  delete: string;
}

export interface AdminUserFormLabels {
  createTitle: string;
  editTitle: string;
  viewTitle: string;
  fullName: string;
  email: string;
  password: string;
  passwordHint: string;
  role: string;
  save: string;
  cancel: string;
}

export type EmailConfirmationFilter = 'confirmed' | 'pending';

export interface EmailStatusOption {
  label: string;
  value: EmailConfirmationFilter;
}
