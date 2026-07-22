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
}
