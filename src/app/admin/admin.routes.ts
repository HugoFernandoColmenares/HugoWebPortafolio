import { Routes } from '@angular/router';
import { providePrimeNG } from 'primeng/config';
import { portfolioPrimePreset } from '../core/config/prime-theme.config';
import { adminGuard, authGuard } from '../core/guards/auth.guard';

/**
 * Admin area, lazy-loaded so PrimeNG (only used here) stays out of the
 * public bundle.
 */
export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./admin.component').then(m => m.AdminComponent),
    canActivate: [authGuard],
    data: { seo: 'private' },
    providers: [
      providePrimeNG({
        theme: {
          preset: portfolioPrimePreset,
          options: {
            darkModeSelector: '[data-theme="dark"]',
            cssLayer: false,
          },
        },
        ripple: true,
      }),
    ],
    children: [
      {
        path: '',
        redirectTo: 'profile',
        pathMatch: 'full',
      },
      {
        path: 'profile',
        loadComponent: () => import('./profile/profile.component').then(m => m.ProfileComponent),
      },
      {
        path: 'project-creator',
        loadComponent: () => import('./project-creator/project-creator.component').then(m => m.ProjectCreatorComponent),
      },
      {
        path: 'admin-panel',
        canActivate: [adminGuard],
        loadComponent: () => import('./admin-panel/admin-panel.component').then(m => m.AdminPanelComponent),
      },
      {
        path: 'social-media',
        canActivate: [adminGuard],
        loadComponent: () => import('./social-media/social-media.component').then(m => m.SocialMediaComponent),
      },
    ],
  },
];
