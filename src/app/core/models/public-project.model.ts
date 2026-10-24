import { CaseStudy, GalleryImage, ProjectLink } from '../data/project-curation';
import { PortfolioProjectStatus, ProjectCategory } from './portfolio-project.model';

/** A portfolio project as shown on the public site (DB row + curation). */
export interface PublicProject {
  id: string;
  slug: string;
  title: string;
  summary: string;
  description: string;
  technologies: string[];
  githubUrl: string | null;
  liveUrl: string | null;
  contentWarning: boolean;
  featured: boolean;
  rank: number;
  status: PortfolioProjectStatus;
  category: ProjectCategory;
  /** Local optimized cover base path, or null. */
  cover: string | null;
  /** Remote (non-stock) cover for rows that have no local version yet. */
  remoteCover: string | null;
  caseStudy: CaseStudy | null;
  related: ProjectLink[];
  gallery: GalleryImage[];
  updatedAt: string;
}
