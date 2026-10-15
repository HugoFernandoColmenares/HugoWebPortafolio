import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  input,
  output,
  signal,
} from '@angular/core';
import {
  DataTableAction,
  DataTableActionEvent,
  DataTableColumn,
  DataTableFilter,
  DataTableOption,
} from '../../../core/models/data-table.model';

@Component({
  selector: 'app-data-table',
  standalone: true,
  templateUrl: './data-table.component.html',
  styleUrl: './data-table.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataTableComponent<T extends { id: string }> {
  readonly rows = input.required<T[]>();
  readonly columns = input.required<DataTableColumn<T>[]>();
  readonly filters = input<DataTableFilter<T>[]>([]);
  readonly actions = input<DataTableAction<T>[]>([]);
  readonly loading = input(false);
  readonly title = input('');
  readonly subtitle = input('');
  readonly emptyLabel = input('No items.');
  readonly loadingLabel = input('Loading...');
  readonly pageSizeLabel = input('Rows');
  readonly prevLabel = input('Previous');
  readonly nextLabel = input('Next');
  readonly pageLabel = input('Page');
  readonly actionsLabel = input('Actions');
  readonly pageSize = input(10);
  readonly pageSizeOptions = input<number[]>([5, 10, 25, 50]);

  readonly action = output<DataTableActionEvent<T>>();

  readonly filterValues = signal<Record<string, unknown>>({});
  readonly currentPage = signal(1);
  readonly selectedPageSize = signal(10);

  readonly filteredRows = computed(() => {
    const defs = this.filters();
    const values = this.filterValues();
    return this.rows().filter(row =>
      defs.every(filter => this.matchesFilter(filter, row, values[filter.id])),
    );
  });

  readonly totalPages = computed(() => {
    const size = this.selectedPageSize();
    const total = this.filteredRows().length;
    return Math.max(1, Math.ceil(total / size));
  });

  readonly pagedRows = computed(() => {
    const size = this.selectedPageSize();
    const page = Math.min(this.currentPage(), this.totalPages());
    const start = (page - 1) * size;
    return this.filteredRows().slice(start, start + size);
  });

  constructor() {
    effect(() => {
      this.pageSize();
      this.selectedPageSize.set(this.pageSize());
    });

    effect(() => {
      this.filteredRows();
      this.currentPage.set(1);
    });
  }

  onSearch(id: string, event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.patchFilter(id, value);
  }

  toggleOption(id: string, option: DataTableOption): void {
    const current = (this.filterValues()[id] as DataTableOption['value'][] | undefined) ?? [];
    const exists = current.some(item => item === option.value);
    const next = exists
      ? current.filter(item => item !== option.value)
      : [...current, option.value];
    this.patchFilter(id, next);
  }

  isSelected(id: string, option: DataTableOption): boolean {
    const current = (this.filterValues()[id] as DataTableOption['value'][] | undefined) ?? [];
    return current.includes(option.value);
  }

  selectedCount(id: string): number {
    const current = (this.filterValues()[id] as unknown[] | undefined) ?? [];
    return current.length;
  }

  onPageSizeChange(event: Event): void {
    const value = Number((event.target as HTMLSelectElement).value);
    this.selectedPageSize.set(value);
    this.currentPage.set(1);
  }

  goToPage(page: number): void {
    const next = Math.min(this.totalPages(), Math.max(1, page));
    this.currentPage.set(next);
  }

  visibleActions(row: T): DataTableAction<T>[] {
    return this.actions().filter(action => action.visible?.(row) ?? true);
  }

  visibleChips(chips: string[]): string[] {
    return chips.slice(0, 3);
  }

  extraChipCount(chips: string[]): number {
    return Math.max(0, chips.length - 3);
  }

  emitAction(id: string, row: T): void {
    this.action.emit({ id, row });
  }

  private patchFilter(id: string, value: unknown): void {
    this.filterValues.update(current => ({ ...current, [id]: value }));
  }

  private matchesFilter(filter: DataTableFilter<T>, row: T, value: unknown): boolean {
    if (filter.type === 'search') {
      const query = String(value ?? '').trim();
      return query.length === 0 ? true : filter.match(row, query);
    }

    const selected = Array.isArray(value) ? value : [];
    return selected.length === 0 ? true : filter.match(row, selected);
  }
}
