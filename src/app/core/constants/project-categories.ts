import type { TranslationKey } from '../services/translation.service';
import { ProjectCategory } from '../models/portfolio-project.model';

export const PROJECT_CATEGORIES: ProjectCategory[] = [
  'web-fullstack',
  'web-frontend',
  'web-backend',
  'mobile',
  'desktop',
  'other',
];

export const PROJECT_CATEGORY_TRANSLATION_KEYS = {
  'web-frontend': 'project_category_web_frontend',
  'web-backend': 'project_category_web_backend',
  'web-fullstack': 'project_category_web_fullstack',
  'mobile': 'project_category_mobile',
  'desktop': 'project_category_desktop',
  'other': 'project_category_other',
} as const satisfies Record<ProjectCategory, TranslationKey>;
