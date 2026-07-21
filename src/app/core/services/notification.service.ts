import { Injectable } from '@angular/core';
import Swal, { SweetAlertIcon, SweetAlertOptions, SweetAlertResult } from 'sweetalert2';
import { appEnvironment } from '../config/app-environment';
import { NotificationConfirmOptions } from '../models/notification.model';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private environmentWarningShown = false;

  success(message: string, title?: string): Promise<SweetAlertResult> {
    return this.showModal('success', message, title);
  }

  error(message: string, title?: string): Promise<SweetAlertResult> {
    return this.showModal('error', message, title);
  }

  warning(message: string, title?: string): Promise<SweetAlertResult> {
    return this.showModal('warning', message, title);
  }

  info(message: string, title?: string): Promise<SweetAlertResult> {
    return this.showModal('info', message, title);
  }

  async confirm(options: NotificationConfirmOptions): Promise<boolean> {
    const result = await Swal.fire({
      icon: options.type ?? 'warning',
      title: options.title,
      text: options.message,
      showCancelButton: true,
      confirmButtonText: options.confirmText ?? 'Confirm',
      cancelButtonText: options.cancelText ?? 'Cancel',
      reverseButtons: true,
      focusCancel: true,
      ...this.baseOptions(),
      customClass: {
        popup: 'app-notification',
        title: 'app-notification__title',
        htmlContainer: 'app-notification__content',
        confirmButton: 'app-notification__confirm',
        cancelButton: 'app-notification__cancel',
      },
    });

    return result.isConfirmed;
  }

  notifyMissingSupabaseConfig(): void {
    if (this.environmentWarningShown) {
      return;
    }

    if (appEnvironment.supabaseUrl && appEnvironment.supabaseKey) {
      return;
    }

    this.environmentWarningShown = true;
    void this.warning(
      'Supabase is not configured. Add NG_APP_SUPABASE_URL and NG_APP_SUPABASE_KEY to your .env file.',
    );
  }

  /** Used when Angular bootstrap fails before dependency injection is available. */
  static showFatalError(message: string): void {
    void Swal.fire({
      icon: 'error',
      title: 'Application error',
      text: message,
      confirmButtonText: 'OK',
      allowOutsideClick: false,
      customClass: {
        popup: 'app-notification',
        title: 'app-notification__title',
        htmlContainer: 'app-notification__content',
        confirmButton: 'app-notification__confirm',
      },
    });
  }

  private showModal(
    icon: SweetAlertIcon,
    message: string,
    title?: string,
  ): Promise<SweetAlertResult> {
    return Swal.fire({
      icon,
      title: title ?? this.defaultTitle(icon),
      text: message,
      confirmButtonText: 'OK',
      ...this.baseOptions(),
      customClass: {
        popup: 'app-notification',
        title: 'app-notification__title',
        htmlContainer: 'app-notification__content',
        confirmButton: 'app-notification__confirm',
      },
    });
  }

  private baseOptions(): Pick<SweetAlertOptions, 'background' | 'color' | 'confirmButtonColor'> {
    const styles = getComputedStyle(document.documentElement);

    return {
      background: styles.getPropertyValue('--color-surface').trim() || '#ffffff',
      color: styles.getPropertyValue('--color-text').trim() || '#334155',
      confirmButtonColor: styles.getPropertyValue('--color-accent-dark').trim() || '#0ea5e9',
    };
  }

  private defaultTitle(icon: SweetAlertIcon): string {
    switch (icon) {
      case 'success':
        return 'Success';
      case 'error':
        return 'Error';
      case 'warning':
        return 'Warning';
      case 'info':
        return 'Information';
      default:
        return 'Notice';
    }
  }
}
