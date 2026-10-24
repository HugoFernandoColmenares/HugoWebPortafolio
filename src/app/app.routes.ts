import { Routes } from '@angular/router';
import { LayoutComponent } from './pages/layout/layout.component';

export const routes: Routes = [
  {
    path: 'auth',
    loadComponent: () => import('./auth/auth.component').then(m => m.AuthComponent),
    data: { seo: 'private' },
    children: [
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full',
      },
      {
        path: 'login',
        loadComponent: () => import('./auth/login/login.component').then(m => m.LoginComponent),
      },
      // Public self-registration was removed: accounts are created by an admin
      // from #/admin/admin-panel. `confirm-register` stays for those invites.
      {
        path: 'register',
        redirectTo: 'login',
        pathMatch: 'full',
      },
      {
        path: 'confirm-register',
        loadComponent: () => import('./auth/confirm-register/confirm-register.component').then(m => m.ConfirmRegisterComponent),
      },
      {
        path: 'recovery-password',
        loadComponent: () => import('./auth/recovery-password/recovery-password.component').then(m => m.RecoveryPasswordComponent),
      },
    ],
  },
  {
    path: 'admin',
    // authGuard lives in ADMIN_ROUTES so Supabase auth stays out of the main bundle.
    data: { seo: 'private' },
    loadChildren: () => import('./admin/admin.routes').then(m => m.ADMIN_ROUTES),
  },
  {
    path: '',
    // Eager: the public shell is needed on every public page (saves a request hop).
    component: LayoutComponent,
    children: [
      {
        path: 'home',
        data: { seo: 'home' },
        loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent),
      },
      {
        path: 'projects',
        data: { seo: 'projects' },
        loadComponent: () => import('./pages/projects/projects.component').then(m => m.ProjectsComponent),
      },
      {
        path: 'projects/:id',
        data: { seo: 'self' },
        loadComponent: () => import('./pages/article/article.component').then(m => m.ArticleComponent),
      },
      {
        path: 'about',
        data: { seo: 'about' },
        loadComponent: () => import('./pages/about/about.component').then(m => m.AboutComponent),
      },
      {
        path: 'contact',
        data: { seo: 'contact' },
        loadComponent: () => import('./pages/contact/contact.component').then(m => m.ContactComponent),
      },
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
      {
        path: '**',
        data: { seo: 'not_found' },
        loadComponent: () => import('./shared/not-found-page/not-found-page.component').then(m => m.NotFoundPageComponent),
      },
    ],
  },
];
