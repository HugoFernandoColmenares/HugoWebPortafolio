export type SocialPlatform =
  | 'github'
  | 'linkedin'
  | 'twitter'
  | 'instagram'
  | 'facebook'
  | 'youtube'
  | 'website'
  | 'other';

export type SocialMediaViewMode = 'list' | 'create' | 'edit' | 'view';

export type SocialMediaContext = 'hero' | 'about';

export interface PlatformOption {
  label: string;
  value: SocialPlatform;
}

export interface SocialMediaLink {
  id: string;
  name: string;
  platform: SocialPlatform;
  url: string;
  icon?: string;
  displayOrder: number;
  showInHero: boolean;
  showInAbout: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface SocialMediaLinkRow {
  id: string;
  name: string;
  platform: SocialPlatform;
  url: string;
  icon?: string;
  display_order: number;
  show_in_hero: boolean;
  show_in_about: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface SocialMediaLinkInput {
  name: string;
  platform: SocialPlatform;
  url: string;
  icon?: string;
  displayOrder: number;
  showInHero: boolean;
  showInAbout: boolean;
  isActive: boolean;
}

export interface SocialMediaTableLabels {
  title: string;
  subtitle: string;
  add: string;
  empty: string;
  filterSearch: string;
  filterPlatform: string;
  filterPlatformPlaceholder: string;
  columnName: string;
  columnPlatform: string;
  columnUrl: string;
  columnIcon: string;
  columnHero: string;
  columnAbout: string;
  columnActive: string;
  columnActions: string;
  yes: string;
  no: string;
  view: string;
  edit: string;
  delete: string;
}

export interface SocialMediaFormLabels {
  createTitle: string;
  editTitle: string;
  viewTitle: string;
  name: string;
  platform: string;
  url: string;
  icon: string;
  iconPlaceholder: string;
  displayOrder: string;
  showInHero: string;
  showInAbout: string;
  isActive: string;
  save: string;
  cancel: string;
}
