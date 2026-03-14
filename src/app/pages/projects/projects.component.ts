import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Project } from '../../core/models/project.model';
import { TranslationService } from '../../core/services/translation.service';
import { ProjectCardComponent } from '../../shared/components/project-card/project-card.component';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, ProjectCardComponent],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.css'
})
export class ProjectsComponent {
  readonly ts = inject(TranslationService);

  readonly activeFilter = signal<string>('All');

  readonly allFilters = ['All', 'Angular', '.NET Core', 'C#', 'TypeScript', 'WPF', 'DDD'];

  readonly projects: Project[] = [
    {
      id: 1,
      titleKey: 'Full-Stack Bakery Management System',
      descriptionKey: 'Enterprise-grade inventory and order management system for a bakery business. Features real-time stock tracking, sales reporting, and role-based access control.',
      imageUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&q=80',
      technologies: ['.NET Core', 'Angular', 'SQL Server', 'Entity Framework', 'TypeScript'],
      githubUrl: 'https://github.com/HugoFernandoColmenares',
      featured: true,
      status: 'completed',
    },
    {
      id: 2,
      titleKey: 'Desktop Image Organizer',
      descriptionKey: 'A WPF desktop application leveraging Domain-Driven Design (DDD) and the Repository Pattern for scalable image categorization and metadata management.',
      imageUrl: 'https://images.unsplash.com/photo-1618477388954-7852f32655ec?w=600&q=80',
      technologies: ['C#', 'WPF', 'DDD', 'SQL Server'],
      githubUrl: 'https://github.com/HugoFernandoColmenares',
      featured: true,
      status: 'completed',
    },
    {
      id: 3,
      titleKey: 'Freelance Client Portal',
      descriptionKey: 'A dashboard for managing freelance contracts featuring JWT authentication, milestone tracking, and invoice generation. Designed to attract independent contracts.',
      imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80',
      technologies: ['Angular', '.NET Core', 'TypeScript', 'SQL Server'],
      status: 'in-progress',
    },
    {
      id: 4,
      titleKey: 'Corporate NGO Landing Page',
      descriptionKey: 'An Angular SSR (Server-Side Rendering) website for an NGO, focusing on top-tier SEO performance, accessibility (WCAG 2.1 AA), and Core Web Vitals.',
      imageUrl: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=600&q=80',
      technologies: ['Angular', 'TypeScript', 'CSS'],
      status: 'planned',
    },
  ];

  get filteredProjects(): Project[] {
    const f = this.activeFilter();
    if (f === 'All') return this.projects;
    return this.projects.filter(p => p.technologies.includes(f));
  }

  setFilter(filter: string): void {
    this.activeFilter.set(filter);
  }
}
