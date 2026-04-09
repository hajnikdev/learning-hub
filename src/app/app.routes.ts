import { Routes } from '@angular/router';
import { authGuard } from './core/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/dashboard/dashboard.component').then((m) => m.DashboardComponent),
    canActivate: [authGuard],
  },
  {
    path: 'topic/:id',
    loadChildren: () => import('./features/topics/topics.module').then((m) => m.TopicsModule),
    canActivate: [authGuard],
  },
  {
    path: 'article/:id',
    loadChildren: () => import('./features/articles/article.module').then((m) => m.ArticleModule),
    canActivate: [authGuard],
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./features/auth/register.component').then((m) => m.RegisterComponent),
  },
  { path: '**', redirectTo: '' },
];
