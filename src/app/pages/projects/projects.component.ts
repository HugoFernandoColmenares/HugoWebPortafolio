import { Component, computed, inject, signal } from '@angular/core';
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

  readonly projects: Project[] = [
    {
      id: 1,
      titleKey: 'Backend Bakery Management System',
      descriptionKey: 'API Backend Enterprise-grade inventory and order management system for a bakery business. Features real-time stock tracking, sales reporting, and role-based access control.',
      imageUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&q=80',
      technologies: ['.NET Core', 'SQLite', 'Entity Framework'],
      githubUrl: 'https://github.com/HugoFernandoColmenares/pasteleriaapi',
      featured: true,
      status: 'completed',
    },
    {
      id: 1,
      titleKey: 'Frontend Bakery Management System',
      descriptionKey: 'Frontedn App Enterprise-grade inventory and order management system for a bakery business. Features real-time stock tracking, sales reporting, and role-based access control.',
      imageUrl: 'https://i.imgur.com/oVbyh2z.jpeg',
      technologies: ['Angular', 'TypeScript', 'CSS'],
      githubUrl: 'https://github.com/HugoFernandoColmenares/PasteleryApp',
      featured: true,
      status: 'completed',
    },
    {
      id: 2,
      titleKey: 'Desktop Image Organizer',
      descriptionKey: 'A WPF desktop application leveraging Domain-Driven Design (DDD) and the Repository Pattern for scalable image categorization and metadata management.',
      imageUrl: 'https://images.unsplash.com/photo-1618477388954-7852f32655ec?w=600&q=80',
      technologies: ['C#', 'WPF', 'DDD', 'SQL Server'],
      githubUrl: 'https://github.com/HugoFernandoColmenares/ReImage',
      featured: true,
      status: 'completed',
    },
    {
      id: 3,
      titleKey: 'Freelance Client Portal',
      descriptionKey: 'A dashboard for managing freelance contracts featuring JWT authentication, milestone tracking, and invoice generation. Designed to attract independent contracts.',
      imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80',
      technologies: ['Ionic', 'Firebase', 'TypeScript'],
      status: 'in-progress',
    },
    {
      id: 4,
      titleKey: 'Corporate NGO Landing Page',
      descriptionKey: 'A HMTL, CSS and JS website for an NGO, focusing on top-tier SEO performance, accessibility (WCAG 2.1 AA), and Core Web Vitals.',
      imageUrl: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=600&q=80',
      githubUrl: 'https://github.com/HugoFernandoColmenares/guitarraLA',
      technologies: ['HTML', 'JavaScript', 'CSS', 'SCSS'],
      status: 'planned',
    },
  ];

  readonly allFilters = computed(() => {
    const technologies = this.projects.flatMap(p => p.technologies);
    const uniqueTechs = [...new Set(technologies)].sort();
    return ['All', ...uniqueTechs];
  });

  get filteredProjects(): Project[] {
    const filter = this.activeFilter();
    if (filter === 'All') return this.projects;
    return this.projects.filter(p => p.technologies.includes(filter));
  }

  setFilter(filter: string): void {
    this.activeFilter.set(filter);
  }
}
