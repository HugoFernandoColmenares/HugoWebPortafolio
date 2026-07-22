import {
  PortfolioProject,
  PortfolioProjectInput,
  PortfolioProjectRow,
} from '../models/portfolio-project.model';

export function mapPortfolioProject(row: PortfolioProjectRow): PortfolioProject {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    imageUrl: row.image_url,
    technologies: row.technologies ?? [],
    githubUrl: row.github_url,
    liveUrl: row.live_url,
    featured: row.featured,
    status: row.status,
    category: row.category,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    deletedAt: row.deleted_at,
  };
}

export function mapPortfolioProjectInputToRow(input: PortfolioProjectInput) {
  return {
    title: input.title.trim(),
    description: input.description.trim(),
    image_url: input.imageUrl.trim(),
    technologies: input.technologies,
    github_url: input.githubUrl?.trim() || null,
    live_url: input.liveUrl?.trim() || null,
    featured: input.featured,
    status: input.status,
    category: input.category,
  };
}
