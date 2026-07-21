import { Routes } from '@angular/router';
import { guestGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/layout/layout.component').then(m => m.LayoutComponent),
    children: [
      {
        path: '',
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
        path: '**',
        loadComponent: () => import('./shared/not-found-page/not-found-page.component').then(m => m.NotFoundPageComponent),
      },
    ],
    pathMatch: 'full',
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
        canActivate: [guestGuard],
      },
      {
        path: 'register',
        loadComponent: () => import('./auth/register/register.component').then(m => m.RegisterComponent),
        canActivate: [guestGuard],
      },
      {
        path: 'confirm-register',
        loadComponent: () => import('./auth/confirm-register/confirm-register.component').then(m => m.ConfirmRegisterComponent),
      },
      {
        path: 'recovery-password',
        loadComponent: () => import('./auth/recovery-password/recovery-password.component').then(m => m.RecoveryPasswordComponent),
        canActivate: [guestGuard],
      },
      {
        path: '**',
        loadComponent: () => import('./shared/not-found-page/not-found-page.component').then(m => m.NotFoundPageComponent),
      },
    ],
  },
  {
    path: '**',
    loadComponent: () => import('./shared/not-found-page/not-found-page.component').then(m => m.NotFoundPageComponent),
  },
];
