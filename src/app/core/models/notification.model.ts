export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface NotificationConfirmOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: NotificationType;
}
