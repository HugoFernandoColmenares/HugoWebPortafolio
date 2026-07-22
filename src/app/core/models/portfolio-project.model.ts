export type PortfolioProjectStatus = 'completed' | 'in-progress' | 'planned';

export type ProjectCategory =
  | 'web-frontend'
  | 'web-backend'
  | 'web-fullstack'
  | 'mobile'
  | 'desktop'
  | 'other';

export type ProjectCreatorViewMode = 'list' | 'create' | 'edit' | 'view';

export interface CategoryOption {
  label: string;
  value: ProjectCategory;
}

export interface PortfolioProject {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  technologies: string[];
  githubUrl: string | null;
  liveUrl: string | null;
  featured: boolean;
  status: PortfolioProjectStatus;
  category: ProjectCategory;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface PortfolioProjectRow {
  id: string;
  title: string;
  description: string;
  image_url: string;
  technologies: string[];
  github_url: string | null;
  live_url: string | null;
  featured: boolean;
  status: PortfolioProjectStatus;
  category: ProjectCategory;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface PortfolioProjectInput {
  title: string;
  description: string;
  imageUrl: string;
  technologies: string[];
  githubUrl: string | null;
  liveUrl: string | null;
  featured: boolean;
  status: PortfolioProjectStatus;
  category: ProjectCategory;
}

export interface ProjectTableLabels {
  title: string;
  subtitle: string;
  add: string;
  empty: string;
  filterSearch: string;
  filterCategory: string;
  filterCategoryPlaceholder: string;
  columnTitle: string;
  columnCategory: string;
  columnStatus: string;
  columnTechnologies: string;
  columnFeatured: string;
  columnActions: string;
  featuredYes: string;
  featuredNo: string;
  view: string;
  edit: string;
  delete: string;
  statusCompleted: string;
  statusInProgress: string;
  statusPlanned: string;
}

export interface ProjectFormLabels {
  createTitle: string;
  editTitle: string;
  viewTitle: string;
  title: string;
  description: string;
  imageUrl: string;
  technologies: string;
  technologiesHint: string;
  githubUrl: string;
  liveUrl: string;
  featured: string;
  status: string;
  category: string;
  save: string;
  cancel: string;
  statusCompleted: string;
  statusInProgress: string;
  statusPlanned: string;
}

export interface ProjectCategorySection {
  category: ProjectCategory;
  label: string;
  projects: PortfolioProject[];
}
