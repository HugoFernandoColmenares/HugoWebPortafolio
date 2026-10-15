import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import {
  CategoryOption,
  PortfolioProject,
  ProjectTableLabels,
} from '../../../core/models/portfolio-project.model';
import { DataTableActionEvent } from '../../../core/models/data-table.model';
import { TranslationService } from '../../../core/services/translation.service';
import {
  buildPortfolioTableColumns,
  buildPortfolioTableFilters,
  portfolioTableCopyFromLabels,
} from '../../../core/utils/portfolio-table.util';
import { DataTableComponent } from '../../../shared/components/data-table/data-table.component';

@Component({
  selector: 'app-project-table',
  standalone: true,
  imports: [DataTableComponent],
  templateUrl: './table.component.html',
  styleUrl: './table.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectTableComponent {
  readonly projects = input.required<PortfolioProject[]>();
  readonly loading = input(false);
  readonly labels = input.required<ProjectTableLabels>();
  readonly categoryOptions = input<CategoryOption[]>([]);
  readonly canManage = input(false);

  readonly addProject = output<void>();
  readonly viewProject = output<PortfolioProject>();
  readonly editProject = output<PortfolioProject>();
  readonly deleteProject = output<PortfolioProject>();

  readonly ts = inject(TranslationService);

  readonly columns = computed(() =>
    buildPortfolioTableColumns(portfolioTableCopyFromLabels(this.labels()), this.categoryOptions(), true),
  );

  readonly filters = computed(() =>
    buildPortfolioTableFilters(portfolioTableCopyFromLabels(this.labels()), this.categoryOptions(), true),
  );

  readonly rowActions = computed(() => {
    const labels = this.labels();
    const manage = this.canManage();
    return [
      { id: 'view', label: labels.view, icon: 'view' as const },
      { id: 'edit', label: labels.edit, icon: 'edit' as const, visible: () => manage },
      { id: 'delete', label: labels.delete, icon: 'delete' as const, visible: () => manage },
    ];
  });

  onAction(event: DataTableActionEvent<PortfolioProject>): void {
    switch (event.id) {
      case 'view':
        this.viewProject.emit(event.row);
        break;
      case 'edit':
        this.editProject.emit(event.row);
        break;
      case 'delete':
        this.deleteProject.emit(event.row);
        break;
    }
  }
}
