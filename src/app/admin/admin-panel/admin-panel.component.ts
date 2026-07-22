import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import {
  AdminPanelViewMode,
  AdminUserFormLabels,
  AdminUserInput,
  AdminUserTableLabels,
  AdminUserUpdateInput,
  EmailStatusOption,
  RoleOption,
} from '../../core/models/admin-user.model';
import { RoleName } from '../../core/models/role.model';
import { UserProfile } from '../../core/models/user.model';
import { AdminUserService } from '../../core/services/admin-user.service';
import { NotificationService } from '../../core/services/notification.service';
import { TranslationService } from '../../core/services/translation.service';
import { UserFormComponent } from './form/form.component';
import { UserTableComponent } from './table/table.component';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [UserTableComponent, UserFormComponent],
  templateUrl: './admin-panel.component.html',
  styleUrl: './admin-panel.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminPanelComponent implements OnInit {
  private readonly userService = inject(AdminUserService);
  private readonly notifications = inject(NotificationService);
  readonly ts = inject(TranslationService);

  readonly viewMode = signal<AdminPanelViewMode>('list');
  readonly users = signal<UserProfile[]>([]);
  readonly roleOptions = signal<RoleOption[]>([]);
  readonly selectedUser = signal<UserProfile | null>(null);
  readonly loading = signal(false);
  readonly saving = signal(false);

  readonly tableLabels = computed<AdminUserTableLabels>(() => {
    const t = this.ts.t();
    return {
      title: t.admin_users_title,
      subtitle: t.admin_users_subtitle,
      add: t.admin_users_add,
      empty: t.admin_users_empty,
      filterSearch: t.admin_users_filter_search,
      filterRole: t.admin_users_filter_role,
      filterRolePlaceholder: t.admin_users_filter_role_placeholder,
      filterEmailStatus: t.admin_users_filter_email_status,
      filterEmailStatusPlaceholder: t.admin_users_filter_email_status_placeholder,
      emailConfirmed: t.admin_users_email_confirmed,
      emailPending: t.admin_users_email_pending,
      columnName: t.admin_users_col_name,
      columnEmail: t.admin_users_col_email,
      columnEmailStatus: t.admin_users_col_email_status,
      columnRole: t.admin_users_col_role,
      columnMemberSince: t.admin_users_col_member_since,
      columnActions: t.admin_users_col_actions,
      view: t.admin_users_action_view,
      edit: t.admin_users_action_edit,
      delete: t.admin_users_action_delete,
    };
  });

  readonly formLabels = computed<AdminUserFormLabels>(() => {
    const t = this.ts.t();
    return {
      createTitle: t.admin_users_form_create,
      editTitle: t.admin_users_form_edit,
      viewTitle: t.admin_users_form_view,
      fullName: t.admin_users_field_full_name,
      email: t.admin_users_field_email,
      password: t.admin_users_field_password,
      passwordHint: t.admin_users_field_password_hint,
      role: t.admin_users_field_role,
      save: t.admin_users_save,
      cancel: t.admin_users_cancel,
    };
  });

  readonly formMode = computed<Exclude<AdminPanelViewMode, 'list'>>(() =>
    this.viewMode() as Exclude<AdminPanelViewMode, 'list'>,
  );

  readonly emailStatusOptions = computed<EmailStatusOption[]>(() => {
    const t = this.ts.t();
    return [
      { value: 'confirmed', label: t.admin_users_email_confirmed },
      { value: 'pending', label: t.admin_users_email_pending },
    ];
  });

  ngOnInit(): void {
    void this.loadData();
  }

  onAddUser(): void {
    this.selectedUser.set(null);
    this.viewMode.set('create');
  }

  onViewUser(user: UserProfile): void {
    this.selectedUser.set(user);
    this.viewMode.set('view');
  }

  onEditUser(user: UserProfile): void {
    this.selectedUser.set(user);
    this.viewMode.set('edit');
  }

  async onDeleteUser(user: UserProfile): Promise<void> {
    const t = this.ts.t();
    const confirmed = await this.notifications.confirm({
      title: t.admin_users_delete_confirm_title,
      message: t.admin_users_delete_confirm_message,
      confirmText: t.admin_users_delete_confirm_yes,
      cancelText: t.admin_users_delete_confirm_no,
      type: 'warning',
    });

    if (!confirmed) {
      return;
    }

    try {
      this.loading.set(true);
      await this.userService.softDelete(user.id);
      this.users.update(items => items.filter(item => item.id !== user.id));
      void this.notifications.success(t.admin_users_delete_success);
    } catch (error) {
      const message =
        error instanceof Error && error.message === 'CANNOT_DELETE_SELF'
          ? t.admin_users_cannot_delete_self
          : t.admin_users_delete_error;
      void this.notifications.error(message);
    } finally {
      this.loading.set(false);
    }
  }

  async onSaveUser(input: AdminUserInput | AdminUserUpdateInput): Promise<void> {
    const t = this.ts.t();

    try {
      this.saving.set(true);
      const mode = this.viewMode();
      const selected = this.selectedUser();

      if (mode === 'create') {
        await this.userService.createUser(input as AdminUserInput);
        void this.notifications.success(t.admin_users_create_confirm_email);
      } else if (mode === 'edit' && selected) {
        await this.userService.updateUser(selected.id, input as AdminUserUpdateInput);
        void this.notifications.success(t.admin_users_save_success);
      }

      await this.loadData();
      this.viewMode.set('list');
      this.selectedUser.set(null);
    } catch {
      void this.notifications.error(t.admin_users_save_error);
    } finally {
      this.saving.set(false);
    }
  }

  onCancelForm(): void {
    this.viewMode.set('list');
    this.selectedUser.set(null);
  }

  private async loadData(): Promise<void> {
    const t = this.ts.t();

    try {
      this.loading.set(true);
      const [users, roles] = await Promise.all([
        this.userService.getAll(),
        this.userService.getRoles(),
      ]);

      this.users.set(users);
      this.roleOptions.set(
        roles.map(role => ({
          value: role.id,
          name: role.name,
          label: this.getRoleLabel(role.name),
        })),
      );
    } catch {
      void this.notifications.error(t.admin_users_load_error);
    } finally {
      this.loading.set(false);
    }
  }

  private getRoleLabel(name: RoleName): string {
    const t = this.ts.t();
    switch (name) {
      case 'ADMIN':
        return t.role_admin;
      case 'MODERATOR':
        return t.role_moderator;
      default:
        return t.role_user;
    }
  }
}
