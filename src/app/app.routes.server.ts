import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'topic/:id',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () => {
      // Return an array of all topic IDs you want to prerender
      return [{ id: 'angular' }, { id: 'docker' }, { id: 'git' }];
    },
  },
  {
    path: 'article/:id',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () => {
      // Return an array of all article IDs you want to prerender
      return [{ id: 'angular-routing' }, { id: 'angular-testing' }];
    },
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender,
  },
];
