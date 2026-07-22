import { Routes } from '@angular/router';
import { authGuard, adminGuard, guestGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/layout/layout.component').then(m => m.LayoutComponent),
    children: [
      {
        path: 'home',
        loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent),
      },
      {
        path: 'projects',
        loadComponent: () => import('./pages/projects/projects.component').then(m => m.ProjectsComponent),
      },
      {
        path: 'about',
        loadComponent: () => import('./pages/about/about.component').then(m => m.AboutComponent),
      },
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: 'auth',
    loadComponent: () => import('./auth/auth.component').then(m => m.AuthComponent),
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
      {
        path: 'register',
        loadComponent: () => import('./auth/register/register.component').then(m => m.RegisterComponent),
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
    loadComponent: () => import('./admin/admin.component').then(m => m.AdminComponent),
    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: 'profile',
        pathMatch: 'full',
      },
      {
        path: 'profile',
        loadComponent: () => import('./admin/profile/profile.component').then(m => m.ProfileComponent),
      },
      {
        path: 'project-creator',
        loadComponent: () => import('./admin/project-creator/project-creator.component').then(m => m.ProjectCreatorComponent),
      },
      {
        path: 'admin-panel',
        canActivate: [adminGuard],
        loadComponent: () => import('./admin/admin-panel/admin-panel.component').then(m => m.AdminPanelComponent),
      },
    ],
  },
  {
    path: '**',
    loadComponent: () => import('./shared/not-found-page/not-found-page.component').then(m => m.NotFoundPageComponent),
  },
];
