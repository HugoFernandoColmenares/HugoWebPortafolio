export interface ProfileUpdateInput {
  fullName: string;
}

export interface ChangePasswordInput {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ProfileFormLabels {
  profileSectionTitle: string;
  passwordSectionTitle: string;
  fullName: string;
  email: string;
  role: string;
  memberSince: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  saveProfile: string;
  changePassword: string;
  passwordHint: string;
  editProfileAction: string;
  changePasswordAction: string;
  cancelAction: string;
}

export type ProfilePanelView = 'summary' | 'edit-profile' | 'change-password';
