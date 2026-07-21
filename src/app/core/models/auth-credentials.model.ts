export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  fullName: string;
}

export interface RecoveryRequest {
  email: string;
}

export interface PasswordUpdateRequest {
  password: string;
  confirmPassword: string;
}

export interface AuthResult {
  requiresEmailConfirmation: boolean;
}

export type ConfirmRegisterStatus = 'loading' | 'success' | 'error' | 'invalid';
