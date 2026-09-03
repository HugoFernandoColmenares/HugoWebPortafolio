import { Skill } from '../models/skill.model';

export const SKILL_CATEGORY_ORDER: Skill['category'][] = [
  'frontend',
  'backend',
  'database',
  'devops',
];

export const SKILL_CATEGORY_TRANSLATION_KEYS: Record<Skill['category'], string> = {
  frontend: 'about_skill_frontend',
  backend: 'about_skill_backend',
  database: 'about_skill_database',
  devops: 'about_skill_devops',
  other: 'about_skill_other',
};
