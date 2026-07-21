import { Injectable, signal, computed } from '@angular/core';

export type Language = 'en' | 'es';

const EN_TRANSLATIONS = {
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
  about_contact_sending: 'Sending...',
  about_contact_success: "Message sent! I'll get back to you soon.",
  about_contact_error: 'Something went wrong. Please try again later.',
  // Footer
  footer_copy: '© 2026 Hugo Fernando Colmenares. All rights reserved.',
  footer_made_with: 'Made with Angular & ♥',
  // Misc
  btn_github: 'GitHub',
  btn_live: 'Live Demo',
  btn_cv: 'Download CV',
  // Auth
  auth_brand_title: 'Welcome back',
  auth_brand_subtitle: 'Sign in to manage your portfolio experience with a secure Supabase-powered account.',
  auth_login_title: 'Sign in',
  auth_login_subtitle: 'Enter your credentials to access your account.',
  auth_register_title: 'Create account',
  auth_register_subtitle: 'Register to get started. We will activate your profile after email confirmation.',
  auth_recovery_title: 'Reset password',
  auth_recovery_subtitle: 'Enter your email and we will send you a recovery link.',
  auth_update_password_title: 'Set new password',
  auth_update_password_subtitle: 'Choose a strong password for your account.',
  auth_email: 'Email',
  auth_password: 'Password',
  auth_confirm_password: 'Confirm password',
  auth_full_name: 'Full name',
  auth_login_submit: 'Sign in',
  auth_register_submit: 'Create account',
  auth_recovery_submit: 'Send recovery link',
  auth_update_password_submit: 'Update password',
  auth_no_account: "Don't have an account?",
  auth_has_account: 'Already have an account?',
  auth_go_register: 'Register',
  auth_go_login: 'Sign in',
  auth_forgot_password: 'Forgot your password?',
  auth_back_login: 'Back to sign in',
  auth_register_confirm_email: 'Check your inbox to confirm your account before signing in.',
  auth_recovery_email_sent: 'Recovery email sent. Check your inbox.',
  auth_password_updated: 'Password updated successfully. You can sign in now.',
  auth_password_mismatch: 'Passwords do not match.',
  auth_generic_error: 'Something went wrong. Please try again.',
  auth_confirm_loading_title: 'Confirming your account',
  auth_confirm_loading_subtitle: 'Please wait while we verify your registration.',
  auth_confirm_success_title: 'Account confirmed!',
  auth_confirm_success_subtitle: 'Your email has been verified and your profile is ready. You can now sign in.',
  auth_confirm_error_title: 'Confirmation failed',
  auth_confirm_error_subtitle: 'The confirmation link is invalid or has expired. Please register again or contact support.',
  auth_confirm_invalid_title: 'Invalid confirmation link',
  auth_confirm_invalid_subtitle: 'Open the confirmation link from your email or register a new account.',
  // Not found
  not_found_title: 'Page not found',
  not_found_subtitle: 'The page you are looking for does not exist or may have been moved.',
  not_found_home: 'Back to home',
  not_found_projects: 'View projects',
} as const;

export type TranslationKey = keyof typeof EN_TRANSLATIONS;
export type Translations = Record<TranslationKey, string>;

const TRANSLATIONS: Record<Language, Translations> = {
  en: EN_TRANSLATIONS,
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
    about_contact_sending: 'Enviando...',
    about_contact_success: '¡Mensaje enviado! Te responderé pronto.',
    about_contact_error: 'Algo salió mal. Por favor, inténtalo de nuevo más tarde.',
    // Footer
    footer_copy: '© 2025 Hugo Fernando Colmenares. Todos los derechos reservados.',
    footer_made_with: 'Hecho con Angular & ♥',
    // Misc
    btn_github: 'GitHub',
    btn_live: 'Demo en Vivo',
    btn_cv: 'Descargar CV',
    // Auth
    auth_brand_title: 'Bienvenido de nuevo',
    auth_brand_subtitle: 'Inicia sesión para gestionar tu experiencia en el portafolio con una cuenta segura impulsada por Supabase.',
    auth_login_title: 'Iniciar sesión',
    auth_login_subtitle: 'Ingresa tus credenciales para acceder a tu cuenta.',
    auth_register_title: 'Crear cuenta',
    auth_register_subtitle: 'Regístrate para comenzar. Activaremos tu perfil después de confirmar tu email.',
    auth_recovery_title: 'Restablecer contraseña',
    auth_recovery_subtitle: 'Ingresa tu email y te enviaremos un enlace de recuperación.',
    auth_update_password_title: 'Nueva contraseña',
    auth_update_password_subtitle: 'Elige una contraseña segura para tu cuenta.',
    auth_email: 'Email',
    auth_password: 'Contraseña',
    auth_confirm_password: 'Confirmar contraseña',
    auth_full_name: 'Nombre completo',
    auth_login_submit: 'Iniciar sesión',
    auth_register_submit: 'Crear cuenta',
    auth_recovery_submit: 'Enviar enlace',
    auth_update_password_submit: 'Actualizar contraseña',
    auth_no_account: '¿No tienes cuenta?',
    auth_has_account: '¿Ya tienes cuenta?',
    auth_go_register: 'Regístrate',
    auth_go_login: 'Inicia sesión',
    auth_forgot_password: '¿Olvidaste tu contraseña?',
    auth_back_login: 'Volver a iniciar sesión',
    auth_register_confirm_email: 'Revisa tu bandeja de entrada para confirmar tu cuenta antes de iniciar sesión.',
    auth_recovery_email_sent: 'Email de recuperación enviado. Revisa tu bandeja de entrada.',
    auth_password_updated: 'Contraseña actualizada. Ya puedes iniciar sesión.',
    auth_password_mismatch: 'Las contraseñas no coinciden.',
    auth_generic_error: 'Algo salió mal. Por favor, inténtalo de nuevo.',
    auth_confirm_loading_title: 'Confirmando tu cuenta',
    auth_confirm_loading_subtitle: 'Espera mientras verificamos tu registro.',
    auth_confirm_success_title: '¡Cuenta confirmada!',
    auth_confirm_success_subtitle: 'Tu email fue verificado y tu perfil está listo. Ya puedes iniciar sesión.',
    auth_confirm_error_title: 'Confirmación fallida',
    auth_confirm_error_subtitle: 'El enlace de confirmación es inválido o expiró. Regístrate de nuevo o contacta soporte.',
    auth_confirm_invalid_title: 'Enlace de confirmación inválido',
    auth_confirm_invalid_subtitle: 'Abre el enlace de confirmación desde tu email o crea una cuenta nueva.',
    // Not found
    not_found_title: 'Página no encontrada',
    not_found_subtitle: 'La página que buscas no existe o fue movida.',
    not_found_home: 'Volver al inicio',
    not_found_projects: 'Ver proyectos',
  },
};

@Injectable({ providedIn: 'root' })
export class TranslationService {
  private readonly STORAGE_KEY = 'portfolio_lang';

  readonly currentLang = signal<Language>(this.getStoredLang());

  readonly t = computed<Translations>(() => TRANSLATIONS[this.currentLang()]);

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
