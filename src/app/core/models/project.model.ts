export interface Project {
  id: number;
  titleKey: string;        // translation key
  descriptionKey: string;  // translation key
  imageUrl: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  featured?: boolean;
  status: 'completed' | 'in-progress' | 'planned';
}
