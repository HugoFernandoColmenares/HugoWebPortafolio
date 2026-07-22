import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { buildPlatformOptions } from '../../core/constants/social-platforms';
import {
  SocialMediaFormLabels,
  SocialMediaLink,
  SocialMediaLinkInput,
  SocialMediaTableLabels,
  SocialMediaViewMode,
} from '../../core/models/social-media.model';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../core/services/notification.service';
import { SocialMediaService } from '../../core/services/social-media.service';
import { TranslationService } from '../../core/services/translation.service';
import { SocialMediaFormComponent } from './form/form.component';
import { SocialMediaTableComponent } from './table/table.component';

@Component({
  selector: 'app-social-media',
  standalone: true,
  imports: [SocialMediaTableComponent, SocialMediaFormComponent],
  templateUrl: './social-media.component.html',
  styleUrl: './social-media.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SocialMediaComponent implements OnInit {
  private readonly socialMediaService = inject(SocialMediaService);
  private readonly notifications = inject(NotificationService);
  private readonly auth = inject(AuthService);
  readonly ts = inject(TranslationService);

  readonly isAdmin = this.auth.isAdmin;
  readonly viewMode = signal<SocialMediaViewMode>('list');
  readonly links = signal<SocialMediaLink[]>([]);
  readonly selectedLink = signal<SocialMediaLink | null>(null);
  readonly loading = signal(false);
  readonly saving = signal(false);

  readonly platformOptions = computed(() =>
    buildPlatformOptions(key => this.ts.t()[key]),
  );

  readonly tableLabels = computed<SocialMediaTableLabels>(() => {
    const t = this.ts.t();
    return {
      title: t.admin_social_title,
      subtitle: t.admin_social_subtitle,
      add: t.admin_social_add,
      empty: t.admin_social_empty,
      filterSearch: t.admin_social_filter_search,
      filterPlatform: t.admin_social_filter_platform,
      filterPlatformPlaceholder: t.admin_social_filter_platform_placeholder,
      columnName: t.admin_social_col_name,
      columnPlatform: t.admin_social_col_platform,
      columnUrl: t.admin_social_col_url,
      columnHero: t.admin_social_col_hero,
      columnAbout: t.admin_social_col_about,
      columnActive: t.admin_social_col_active,
      columnActions: t.admin_social_col_actions,
      yes: t.admin_social_yes,
      no: t.admin_social_no,
      view: t.admin_social_action_view,
      edit: t.admin_social_action_edit,
      delete: t.admin_social_action_delete,
    };
  });

  readonly formLabels = computed<SocialMediaFormLabels>(() => {
    const t = this.ts.t();
    return {
      createTitle: t.admin_social_form_create,
      editTitle: t.admin_social_form_edit,
      viewTitle: t.admin_social_form_view,
      name: t.admin_social_field_name,
      platform: t.admin_social_field_platform,
      url: t.admin_social_field_url,
      displayOrder: t.admin_social_field_display_order,
      showInHero: t.admin_social_field_show_in_hero,
      showInAbout: t.admin_social_field_show_in_about,
      isActive: t.admin_social_field_is_active,
      save: t.admin_social_save,
      cancel: t.admin_social_cancel,
    };
  });

  readonly formMode = computed<Exclude<SocialMediaViewMode, 'list'>>(() =>
    this.viewMode() as Exclude<SocialMediaViewMode, 'list'>,
  );

  ngOnInit(): void {
    void this.loadLinks();
  }

  onAddLink(): void {
    this.selectedLink.set(null);
    this.viewMode.set('create');
  }

  onViewLink(link: SocialMediaLink): void {
    this.selectedLink.set(link);
    this.viewMode.set('view');
  }

  onEditLink(link: SocialMediaLink): void {
    this.selectedLink.set(link);
    this.viewMode.set('edit');
  }

  async onDeleteLink(link: SocialMediaLink): Promise<void> {
    const t = this.ts.t();
    const confirmed = await this.notifications.confirm({
      title: t.admin_social_delete_confirm_title,
      message: t.admin_social_delete_confirm_message,
      confirmText: t.admin_social_delete_confirm_yes,
      cancelText: t.admin_social_delete_confirm_no,
      type: 'warning',
    });

    if (!confirmed) {
      return;
    }

    try {
      this.loading.set(true);
      await this.socialMediaService.softDelete(link.id);
      this.links.update(items => items.filter(item => item.id !== link.id));
      void this.notifications.success(t.admin_social_delete_success);
    } catch {
      void this.notifications.error(t.admin_social_delete_error);
    } finally {
      this.loading.set(false);
    }
  }

  async onSaveLink(input: SocialMediaLinkInput): Promise<void> {
    const t = this.ts.t();

    try {
      this.saving.set(true);
      const mode = this.viewMode();
      const selected = this.selectedLink();

      if (mode === 'edit' && selected) {
        await this.socialMediaService.update(selected.id, input);
      } else {
        await this.socialMediaService.create(input);
      }

      await this.loadLinks();
      this.viewMode.set('list');
      this.selectedLink.set(null);
      void this.notifications.success(t.admin_social_save_success);
    } catch {
      void this.notifications.error(t.admin_social_save_error);
    } finally {
      this.saving.set(false);
    }
  }

  onCancelForm(): void {
    this.viewMode.set('list');
    this.selectedLink.set(null);
  }

  private async loadLinks(): Promise<void> {
    const t = this.ts.t();

    try {
      this.loading.set(true);
      this.links.set(await this.socialMediaService.getAll());
    } catch {
      void this.notifications.error(t.admin_social_load_error);
    } finally {
      this.loading.set(false);
    }
  }
}
