import { Routes } from '@angular/router';
import { DashboardComponent } from './features/dashboard/dashboard.component';

export const routes: Routes = [
  { path: '', component: DashboardComponent },
  {
    path: 'topic/:id',
    loadChildren: () => import('./features/topics/topics.module').then((m) => m.TopicsModule),
  },
  {
    path: 'article/:id',
    loadChildren: () => import('./features/articles/article.module').then((m) => m.ArticleModule),
  },
];
