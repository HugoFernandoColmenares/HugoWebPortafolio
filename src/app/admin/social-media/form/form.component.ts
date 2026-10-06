import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  output,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Button } from 'primeng/button';
import { Checkbox } from 'primeng/checkbox';
import { InputNumber } from 'primeng/inputnumber';
import { InputText } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { SOCIAL_PLATFORM_ICONS } from '../../../core/constants/social-platforms';
import {
  PlatformOption,
  SocialMediaFormLabels,
  SocialMediaLink,
  SocialMediaLinkInput,
  SocialMediaViewMode,
  SocialPlatform,
} from '../../../core/models/social-media.model';

@Component({
  selector: 'app-social-media-form',
  standalone: true,
  imports: [ReactiveFormsModule, InputText, InputNumber, Select, Checkbox, Button],
  templateUrl: './form.component.html',
  styleUrl: './form.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SocialMediaFormComponent {
  readonly mode = input.required<Exclude<SocialMediaViewMode, 'list'>>();
  readonly link = input<SocialMediaLink | null>(null);
  readonly loading = input(false);
  readonly labels = input.required<SocialMediaFormLabels>();
  readonly platformOptions = input<PlatformOption[]>([]);

  readonly saveLink = output<SocialMediaLinkInput>();
  readonly cancelForm = output<void>();

  private readonly fb = inject(FormBuilder);

  readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    platform: [null as SocialPlatform | null, [Validators.required]],
    url: ['', [Validators.required, Validators.pattern(/^https?:\/\/.+/i)]],
    icon: [''],
    displayOrder: [0, [Validators.required, Validators.min(0)]],
    showInHero: [true],
    showInAbout: [true],
    isActive: [true],
  });

  readonly heading = computed(() => {
    const labels = this.labels();
    switch (this.mode()) {
      case 'edit':
        return labels.editTitle;
      case 'view':
        return labels.viewTitle;
      default:
        return labels.createTitle;
    }
  });

  readonly subtitle = computed(() => {
    const labels = this.labels();
    switch (this.mode()) {
      case 'edit':
        return labels.editSubtitle;
      case 'view':
        return labels.viewSubtitle;
      default:
        return labels.createSubtitle;
    }
  });

  constructor() {
    effect(() => {
      const item = this.link();
      const isReadOnly = this.mode() === 'view';

      if (item) {
        this.form.reset({
          name: item.name,
          platform: item.platform,
          url: item.url,
          icon: item.icon || SOCIAL_PLATFORM_ICONS[item.platform],
          displayOrder: item.displayOrder,
          showInHero: item.showInHero,
          showInAbout: item.showInAbout,
          isActive: item.isActive,
        });
      } else {
        this.form.reset({
          name: '',
          platform: null,
          url: '',
          icon: '',
          displayOrder: 0,
          showInHero: true,
          showInAbout: true,
          isActive: true,
        });
      }

      if (isReadOnly) {
        this.form.disable({ emitEvent: false });
        return;
      }

      this.form.enable({ emitEvent: false });
    });
  }

  onPlatformChange(): void {
    const platform = this.form.controls.platform.value;
    if (!platform) {
      return;
    }

    this.form.controls.icon.setValue(SOCIAL_PLATFORM_ICONS[platform]);
  }

  onSubmit(): void {
    if (this.mode() === 'view' || this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const raw = this.form.getRawValue();
    if (!raw.platform) {
      this.form.controls.platform.markAsTouched();
      return;
    }

    this.saveLink.emit({
      ...raw,
      platform: raw.platform,
      icon: raw.icon || SOCIAL_PLATFORM_ICONS[raw.platform],
    });
  }
}
