import {
  DataTableColumn,
  DataTableFilter,
} from '../models/data-table.model';
import {
  CategoryOption,
  PortfolioProject,
  PortfolioProjectStatus,
  ProjectTableLabels,
} from '../models/portfolio-project.model';

export interface PortfolioTableCopy {
  searchPlaceholder: string;
  categoryPlaceholder: string;
  statusPlaceholder: string;
  featuredPlaceholder: string;
  statusCompleted: string;
  statusInProgress: string;
  statusPlanned: string;
  featuredYes: string;
  featuredNo: string;
  columnTitle: string;
  columnCategory: string;
  columnStatus: string;
  columnTechnologies: string;
  columnFeatured: string;
}

export function portfolioTableCopyFromLabels(labels: ProjectTableLabels): PortfolioTableCopy {
  return {
    searchPlaceholder: labels.filterSearch,
    categoryPlaceholder: labels.filterCategoryPlaceholder,
    statusPlaceholder: labels.filterStatusPlaceholder,
    featuredPlaceholder: labels.filterFeaturedPlaceholder,
    statusCompleted: labels.statusCompleted,
    statusInProgress: labels.statusInProgress,
    statusPlanned: labels.statusPlanned,
    featuredYes: labels.featuredYes,
    featuredNo: labels.featuredNo,
    columnTitle: labels.columnTitle,
    columnCategory: labels.columnCategory,
    columnStatus: labels.columnStatus,
    columnTechnologies: labels.columnTechnologies,
    columnFeatured: labels.columnFeatured,
  };
}

export function buildPortfolioTableFilters(
  copy: PortfolioTableCopy,
  categories: CategoryOption[],
  includeFeatured: boolean,
): DataTableFilter<PortfolioProject>[] {
  const filters: DataTableFilter<PortfolioProject>[] = [
    {
      id: 'search',
      type: 'search',
      placeholder: copy.searchPlaceholder,
      match: (row, value) => {
        const query = String(value).trim().toLowerCase();
        const category = categories.find(option => option.value === row.category)?.label ?? row.category;
        return [row.title, row.description, row.technologies.join(' '), category]
          .join(' ')
          .toLowerCase()
          .includes(query);
      },
    },
    {
      id: 'category',
      type: 'multi-select',
      placeholder: copy.categoryPlaceholder,
      options: categories.map(option => ({ label: option.label, value: option.value })),
      match: (row, value) => selected(value).includes(row.category),
    },
    {
      id: 'status',
      type: 'multi-select',
      placeholder: copy.statusPlaceholder,
      options: [
        { label: copy.statusCompleted, value: 'completed' },
        { label: copy.statusInProgress, value: 'in-progress' },
        { label: copy.statusPlanned, value: 'planned' },
      ],
      match: (row, value) => selected(value).includes(row.status),
    },
  ];

  if (includeFeatured) {
    filters.push({
      id: 'featured',
      type: 'multi-select',
      placeholder: copy.featuredPlaceholder,
      options: [
        { label: copy.featuredYes, value: true },
        { label: copy.featuredNo, value: false },
      ],
      match: (row, value) => selected(value).includes(row.featured),
    });
  }

  return filters;
}

export function buildPortfolioTableColumns(
  copy: PortfolioTableCopy,
  categories: CategoryOption[],
  includeFeatured: boolean,
): DataTableColumn<PortfolioProject>[] {
  const columns: DataTableColumn<PortfolioProject>[] = [
    { id: 'title', header: copy.columnTitle, cell: 'text', text: row => row.title },
    {
      id: 'category',
      header: copy.columnCategory,
      cell: 'tag',
      tone: () => 'secondary',
      text: row => categories.find(option => option.value === row.category)?.label ?? row.category,
    },
    {
      id: 'status',
      header: copy.columnStatus,
      cell: 'tag',
      tone: row => statusTone(row.status),
      text: row => statusLabel(row.status, copy),
    },
    {
      id: 'technologies',
      header: copy.columnTechnologies,
      cell: 'chips',
      text: () => '',
      chips: row => row.technologies,
    },
  ];

  if (includeFeatured) {
    columns.push({
      id: 'featured',
      header: copy.columnFeatured,
      cell: 'tag',
      tone: row => (row.featured ? 'success' : 'secondary'),
      text: row => (row.featured ? copy.featuredYes : copy.featuredNo),
    });
  }

  return columns;
}

function selected(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

function statusLabel(status: PortfolioProjectStatus, copy: PortfolioTableCopy): string {
  switch (status) {
    case 'completed':
      return copy.statusCompleted;
    case 'in-progress':
      return copy.statusInProgress;
    default:
      return copy.statusPlanned;
  }
}

function statusTone(status: PortfolioProjectStatus): 'success' | 'warn' | 'info' {
  switch (status) {
    case 'completed':
      return 'success';
    case 'in-progress':
      return 'warn';
    default:
      return 'info';
  }
}
