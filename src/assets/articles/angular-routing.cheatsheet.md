## Basic Concepts
- **SPA (Single Page Application):** One HTML file, dynamic content via JS, no reloads.
- **Routing:** Updates UI and browser URL based on navigation.
- **Router:** Provided via `provideRouter(routes)` in `providers`.

## Setup
- In `main.ts` (standalone):
  ```ts
  import { provideRouter } from '@angular/router';
  bootstrapApplication(AppComponent, {
    providers: [provideRouter(routes)]
  });
  ```
- In module-based apps, add to module `providers`.
- Routings are often outsourced to `app.routes.ts`.

## Route Definition
- Route = `{ path: 'tasks', component: TasksComponent }`
- Export routes array:
  ```ts
  export const routes: Routes = [ ... ];
  ```

## Router Outlet
- Place `<router-outlet></router-outlet>` in template where routed components should render.
- Import `RouterOutlet` in component and add to `imports`.

## Navigation
- Use `[routerLink]` instead of `<a href>` for SPA navigation:
  ```html
  <a [routerLink]="'/tasks'">Tasks</a>
  ```
- Highlight active link:
  ```html
  <a [routerLink]="'/tasks'" routerLinkActive="selected">Tasks</a>
  ```

## Dynamic Routes
- Use `:param` for dynamic segments:
  ```ts
  { path: 'users/:userId/tasks', component: TasksComponent }
  ```
- Bind param to component input:
  ```ts
  @Input({ required: true }) userId!: string;
  ```
- Enable input binding:
  ```ts
  provideRouter(routes, withComponentInputBinding())
  ```

## Child Routes
- Define children in route:
  ```ts
  {
    path: 'users/:userId',
    component: UserTasksComponent,
    children: [
      { path: 'tasks', component: TasksComponent },
      { path: 'tasks/new', component: NewTaskComponent }
    ]
  }
  ```
- Parent component must have `<router-outlet>` for children.

## Programmatic Navigation
- Inject `Router` and use:
  ```ts
  router.navigate(['/users', userId, 'tasks']);
  router.navigateByUrl('/users/U2/tasks');
  ```
- Options:
  - `relativeTo`, `queryParams`, `fragment`, `replaceUrl`, `state`, etc.

## Not Found & Redirects
- Catch-all route:
  ```ts
  { path: '**', component: NotFoundComponent }
  ```
- Redirect:
  ```ts
  { path: '', redirectTo: 'tasks', pathMatch: 'full' }
  ```

## ActivatedRoute & Snapshot
- Access params:
  ```ts
  constructor(private route: ActivatedRoute) {}
  ngOnInit() {
    const userId = this.route.snapshot.paramMap.get('userId');
  }
  ```
- Use snapshot for static access, subscribe for dynamic changes.

## Query Params
- Add query params:
  ```html
  <a [routerLink]="['.']" [queryParams]="{ order: 'asc' }">Sort</a>
  ```
- Read in component:
  ```ts
  @Input() order?: string;
  // or
  this.route.queryParams.subscribe(params => { ... });
  ```

## Static Data
- Add static data to route:
  ```ts
  { path: 'tasks', component: TasksComponent, data: { message: 'Hello!' } }
  ```
- Available as input if using `withComponentInputBinding`.

## Resolvers
- Preload data before route activation:
  ```ts
  { path: 'tasks', component: TasksComponent, resolve: { tasks: tasksResolver } }
  ```
- Resolver is a function:
  ```ts
  const tasksResolver: ResolveFn<Tasks[]> = (route, state) => ...;
  ```
- Use `runGuardsAndResolvers: 'paramsOrQueryParamsChange'` for reactivity.

## Titles
- Static title:
  ```ts
  { path: 'tasks', component: TasksComponent, title: 'Tasks' }
  ```
- Dynamic title:
  ```ts
  { path: 'tasks/:id', component: TasksComponent, title: titleResolver }
  ```

## Guards
- Types: `canMatch`, `canActivate`, `canActivateChild`, `canDeactivate`
- Example `canMatch` guard:
  ```ts
  const myGuard: CanMatchFn = (route, segments) => true | false | RedirectCommand;
  ```

---

## Quick Reference
- **Router Setup:** `provideRouter(routes)`
- **Outlet:** `<router-outlet>`
- **Navigation:** `[routerLink]`, `router.navigate()`
- **Dynamic Params:** `:param`, `@Input()`
- **Child Routes:** `children: []`, nested `<router-outlet>`
- **Resolvers:** `resolve: { ... }`, `runGuardsAndResolvers`
- **Guards:** `canMatch`, `canActivate`, etc.
- **Titles:** `title: '...'` or resolver
- **Not Found:** `{ path: '**', ... }`
- **Redirect:** `{ path: '', redirectTo: '...', pathMatch: 'full' }`
