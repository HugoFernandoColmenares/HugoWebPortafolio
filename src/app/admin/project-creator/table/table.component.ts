import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
} from '@angular/core';
import { Button } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { Tag } from 'primeng/tag';
import { Tooltip } from 'primeng/tooltip';
import {
  PortfolioProject,
  PortfolioProjectStatus,
  ProjectTableLabels,
} from '../../../core/models/portfolio-project.model';

@Component({
  selector: 'app-project-table',
  standalone: true,
  imports: [TableModule, Button, Tag, Tooltip],
  templateUrl: './table.component.html',
  styleUrl: './table.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectTableComponent {
  readonly projects = input.required<PortfolioProject[]>();
  readonly loading = input(false);
  readonly labels = input.required<ProjectTableLabels>();

  readonly addProject = output<void>();
  readonly viewProject = output<PortfolioProject>();
  readonly editProject = output<PortfolioProject>();
  readonly deleteProject = output<PortfolioProject>();

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
}
