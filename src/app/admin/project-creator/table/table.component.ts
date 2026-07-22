import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Button } from 'primeng/button';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputText } from 'primeng/inputtext';
import { MultiSelect } from 'primeng/multiselect';
import { TableModule } from 'primeng/table';
import { Tag } from 'primeng/tag';
import { Tooltip } from 'primeng/tooltip';
import {
  CategoryOption,
  PortfolioProject,
  PortfolioProjectStatus,
  ProjectCategory,
  ProjectTableLabels,
} from '../../../core/models/portfolio-project.model';

@Component({
  selector: 'app-project-table',
  standalone: true,
  imports: [
    FormsModule,
    TableModule,
    Button,
    Tag,
    Tooltip,
    InputText,
    IconField,
    InputIcon,
    MultiSelect,
  ],
  templateUrl: './table.component.html',
  styleUrl: './table.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectTableComponent {
  readonly projects = input.required<PortfolioProject[]>();
  readonly loading = input(false);
  readonly labels = input.required<ProjectTableLabels>();
  readonly categoryOptions = input<CategoryOption[]>([]);

  readonly addProject = output<void>();
  readonly viewProject = output<PortfolioProject>();
  readonly editProject = output<PortfolioProject>();
  readonly deleteProject = output<PortfolioProject>();

  readonly searchTerm = signal('');
  readonly selectedCategories = signal<ProjectCategory[]>([]);
  readonly rowsPerPage = 10;

  readonly filteredProjects = computed(() => {
    const query = this.searchTerm().trim().toLowerCase();
    const categories = this.selectedCategories();
    let items = this.projects();

    if (query) {
      items = items.filter(project => {
        const haystack = [
          project.title,
          project.description,
          project.technologies.join(' '),
          this.categoryLabel(project.category),
        ]
          .join(' ')
          .toLowerCase();

        return haystack.includes(query);
      });
    }

    if (categories.length > 0) {
      items = items.filter(project => categories.includes(project.category));
    }

    return items;
  });

  categoryLabel(category: ProjectCategory): string {
    return (
      this.categoryOptions().find(option => option.value === category)?.label ??
      category
    );
  }

  statusLabel(status: PortfolioProjectStatus): string {
    const labels = this.labels();
    switch (status) {
      case 'completed':
        return labels.statusCompleted;
      case 'in-progress':
        return labels.statusInProgress;
      default:
        return labels.statusPlanned;
    }
  }

  statusSeverity(status: PortfolioProjectStatus): 'success' | 'warn' | 'info' {
    switch (status) {
      case 'completed':
        return 'success';
      case 'in-progress':
        return 'warn';
      default:
        return 'info';
    }
  }

  onSearchInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchTerm.set(value);
  }
}
