import { Injectable, signal, computed } from '@angular/core';

export type Language = 'en' | 'es';

const TRANSLATIONS = {
  en: {
    // Nav
    nav_home: 'Home',
    nav_projects: 'Projects',
    nav_about: 'About',
    nav_contact: 'Contact',
    // Hero
    hero_greeting: "Hi, I'm",
    hero_name: 'Hugo Colmenares',
    hero_title: 'Full-Stack Software Developer',
    hero_subtitle: 'I build scalable, high-performance applications with Angular & .NET Core.',
    hero_cta_projects: 'View My Projects',
    hero_cta_about: 'About Me',
    // Projects
    projects_heading: 'My Projects',
    projects_subheading: "A selection of things I've built.",
    projects_filter_all: 'All',
    projects_status_completed: 'Completed',
    projects_status_wip: 'In Progress',
    // About
    about_heading: 'About Me',
    about_bio: 'I am a passionate Full-Stack Developer with experience in building enterprise applications using Angular, .NET Core, and SQL Server. I care about clean architecture, SOLID principles, and delivering excellent user experiences.',
    about_skills_heading: 'Tech Stack',
    about_contact_heading: 'Get in Touch',
    about_contact_submit: 'Send Message',
    about_contact_name: 'Your Name',
    about_contact_email: 'Your Email',
    about_contact_message: 'Your Message',
    // Footer
    footer_copy: '© 2026 Hugo Fernando Colmenares. All rights reserved.',
    footer_made_with: 'Made with Angular & ♥',
    // Misc
    btn_github: 'GitHub',
    btn_live: 'Live Demo',
    btn_cv: 'Download CV',
  },
  es: {
    // Nav
    nav_home: 'Inicio',
    nav_projects: 'Proyectos',
    nav_about: 'Acerca de',
    nav_contact: 'Contacto',
    // Hero
    hero_greeting: 'Hola, soy',
    hero_name: 'Hugo Colmenares',
    hero_title: 'Desarrollador de Software Full-Stack',
    hero_subtitle: 'Construyo aplicaciones escalables y de alto rendimiento con Angular & .NET Core.',
    hero_cta_projects: 'Ver Mis Proyectos',
    hero_cta_about: 'Acerca de Mí',
    // Projects
    projects_heading: 'Mis Proyectos',
    projects_subheading: 'Una selección de cosas que he construido.',
    projects_filter_all: 'Todos',
    projects_status_completed: 'Completado',
    projects_status_wip: 'En Progreso',
    // About
    about_heading: 'Acerca de Mí',
    about_bio: 'Soy un Desarrollador Full-Stack apasionado con experiencia en el desarrollo de aplicaciones empresariales usando Angular, .NET Core y SQL Server. Me preocupo por la arquitectura limpia, los principios SOLID y ofrecer excelentes experiencias de usuario.',
    about_skills_heading: 'Tecnologías',
    about_contact_heading: 'Contáctame',
    about_contact_submit: 'Enviar Mensaje',
    about_contact_name: 'Tu Nombre',
    about_contact_email: 'Tu Email',
    about_contact_message: 'Tu Mensaje',
    // Footer
    footer_copy: '© 2025 Hugo Fernando Colmenares. Todos los derechos reservados.',
    footer_made_with: 'Hecho con Angular & ♥',
    // Misc
    btn_github: 'GitHub',
    btn_live: 'Demo en Vivo',
    btn_cv: 'Descargar CV',
  },
};

@Injectable({ providedIn: 'root' })
export class TranslationService {
  private readonly STORAGE_KEY = 'portfolio_lang';

  readonly currentLang = signal<Language>(this.getStoredLang());

  readonly t = computed(() => TRANSLATIONS[this.currentLang()]);

  setLanguage(lang: Language): void {
    this.currentLang.set(lang);
    localStorage.setItem(this.STORAGE_KEY, lang);
  }

  toggleLanguage(): void {
    this.setLanguage(this.currentLang() === 'en' ? 'es' : 'en');
  }

  private getStoredLang(): Language {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    return stored === 'en' || stored === 'es' ? stored : 'en';
  }
}
