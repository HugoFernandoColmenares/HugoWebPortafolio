export type DataTableFilterType = 'search' | 'multi-select';

export type DataTableCellKind = 'text' | 'tag' | 'chips';

export type DataTableTagTone = 'success' | 'warn' | 'info' | 'secondary';

export interface DataTableOption {
  label: string;
  value: string | boolean | number;
}

export interface DataTableFilter<T> {
  id: string;
  type: DataTableFilterType;
  placeholder: string;
  options?: DataTableOption[];
  match: (row: T, value: unknown) => boolean;
}

export interface DataTableColumn<T> {
  id: string;
  header: string;
  cell: DataTableCellKind;
  text: (row: T) => string;
  tone?: (row: T) => DataTableTagTone;
  chips?: (row: T) => string[];
}

export interface DataTableAction<T> {
  id: string;
  label: string;
  icon: 'view' | 'edit' | 'delete' | 'link';
  visible?: (row: T) => boolean;
}

export interface DataTableActionEvent<T> {
  id: string;
  row: T;
}
