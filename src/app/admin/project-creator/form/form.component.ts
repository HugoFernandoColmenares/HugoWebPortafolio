import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Button } from 'primeng/button';
import { Checkbox } from 'primeng/checkbox';
import { InputText } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { Textarea } from 'primeng/textarea';
import {
  PortfolioProject,
  PortfolioProjectInput,
  PortfolioProjectStatus,
  ProjectCategory,
  ProjectCreatorViewMode,
  CategoryOption,
  ProjectFormLabels,
} from '../../../core/models/portfolio-project.model';
import { ImageService } from '../../../core/services/image.service';
import { NotificationService } from '../../../core/services/notification.service';
import { TranslationService } from '../../../core/services/translation.service';

interface StatusOption {
  label: string;
  value: PortfolioProjectStatus;
}

@Component({
  selector: 'app-project-form',
  standalone: true,
  imports: [ReactiveFormsModule, InputText, Textarea, Select, Checkbox, Button],
  templateUrl: './form.component.html',
  styleUrl: './form.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectFormComponent {
  readonly mode = input.required<Exclude<ProjectCreatorViewMode, 'list'>>();
  readonly project = input<PortfolioProject | null>(null);
  readonly loading = input(false);
  readonly labels = input.required<ProjectFormLabels>();
  readonly categoryOptions = input<CategoryOption[]>([]);

  readonly saveProject = output<PortfolioProjectInput>();
  readonly cancelForm = output<void>();

  private readonly fb = inject(FormBuilder);
  private readonly imageService = inject(ImageService);
  private readonly notifications = inject(NotificationService);
  private readonly ts = inject(TranslationService);
  private readonly fileInput = viewChild<ElementRef<HTMLInputElement>>('fileInput');

  readonly uploadingImage = signal(false);

  readonly form = this.fb.nonNullable.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    description: ['', [Validators.required, Validators.minLength(10)]],
    imageUrl: ['', [Validators.required, Validators.pattern(/^https?:\/\/.+/i)]],
    technologiesText: ['', [Validators.required]],
    githubUrl: [''],
    liveUrl: [''],
    featured: [false],
    status: ['planned' as PortfolioProjectStatus, [Validators.required]],
    category: ['web-fullstack' as ProjectCategory, [Validators.required]],
  });

  readonly statusOptions = computed<StatusOption[]>(() => {
    const labels = this.labels();
    return [
      { label: labels.statusCompleted, value: 'completed' },
      { label: labels.statusInProgress, value: 'in-progress' },
      { label: labels.statusPlanned, value: 'planned' },
    ];
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

  constructor() {
    effect(() => {
      const project = this.project();
      const isReadOnly = this.mode() === 'view';

      if (project) {
        this.form.reset({
          title: project.title,
          description: project.description,
          imageUrl: project.imageUrl,
          technologiesText: project.technologies.join(', '),
          githubUrl: project.githubUrl ?? '',
          liveUrl: project.liveUrl ?? '',
          featured: project.featured,
          status: project.status,
          category: project.category,
        });
      } else {
        this.form.reset({
          title: '',
          description: '',
          imageUrl: '',
          technologiesText: '',
          githubUrl: '',
          liveUrl: '',
          featured: false,
          status: 'planned',
          category: 'web-fullstack',
        });
      }

      if (isReadOnly) {
        this.form.disable({ emitEvent: false });
        return;
      }

      this.form.enable({ emitEvent: false });
    });
  }

  get f() {
    return this.form.controls;
  }

  onSubmit(): void {
    if (this.mode() === 'view') {
      return;
    }

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const raw = this.form.getRawValue();
    const technologies = raw.technologiesText
      .split(',')
      .map(item => item.trim())
      .filter(Boolean);

    this.saveProject.emit({
      title: raw.title,
      description: raw.description,
      imageUrl: raw.imageUrl,
      technologies,
      githubUrl: raw.githubUrl.trim() || null,
      liveUrl: raw.liveUrl.trim() || null,
      featured: raw.featured,
      status: raw.status,
      category: raw.category,
    });
  }

  triggerImagePicker(): void {
    this.fileInput()?.nativeElement.click();
  }

  async onImageSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    input.value = '';

    if (!file || this.mode() === 'view') {
      return;
    }

    const t = this.ts.t();

    try {
      this.uploadingImage.set(true);
      const publicUrl = await this.imageService.uploadOptimizedImage(file, 'projects');
      this.form.controls.imageUrl.setValue(publicUrl);
      this.form.controls.imageUrl.markAsDirty();
    } catch (error) {
      let message = t.admin_image_upload_error;
      if (error instanceof Error) {
        if (error.message === 'INVALID_IMAGE_TYPE') {
          message = t.admin_image_invalid_type;
        } else if (error.message === 'IMAGE_TOO_LARGE') {
          message = t.admin_image_too_large;
        }
      }
      void this.notifications.error(message);
    } finally {
      this.uploadingImage.set(false);
    }
  }
}
