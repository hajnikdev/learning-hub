## Základné koncepty
- **SPA (Single Page Application):** Jeden HTML súbor, dynamický obsah cez JS, žiadne reloady.
- **Routing:** Aktualizuje UI a URL v prehliadači na základe navigácie.
- **Router:** Poskytovaný cez `provideRouter(routes)` v `providers`.

## Nastavenie
- V `main.ts` (standalone):
  ```ts
  import { provideRouter } from '@angular/router';
  bootstrapApplication(AppComponent, {
    providers: [provideRouter(routes)]
  });
  ```
- V module-based aplikáciách pridať do module `providers`.
- Routy sa často ukladajú do `app.routes.ts`.

## Definícia Route
- Route = `{ path: 'tasks', component: TasksComponent }`
- Export routes poľa:
  ```ts
  export const routes: Routes = [ ... ];
  ```

## Router Outlet
- Umiestnite `<router-outlet></router-outlet>` v template tam, kde sa majú vykresliť routované komponenty.
- Importujte `RouterOutlet` v komponente a pridajte do `imports`.

## Navigácia
- Použite `[routerLink]` namiesto `<a href>` pre SPA navigáciu:
  ```html
  <a [routerLink]="'/tasks'">Úlohy</a>
  ```
- Zvýraznenie aktívneho odkazu:
  ```html
  <a [routerLink]="'/tasks'" routerLinkActive="selected">Úlohy</a>
  ```

## Dynamické Routes
- Použite `:param` pre dynamické segmenty:
  ```ts
  { path: 'users/:userId/tasks', component: TasksComponent }
  ```
- Pripojenie parametru na component input:
  ```ts
  @Input({ required: true }) userId!: string;
  ```
- Povolenie input bindingu:
  ```ts
  provideRouter(routes, withComponentInputBinding())
  ```

## Vnorené Routes (Child Routes)
- Definícia children v route:
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
- Rodičovský komponent musí mať `<router-outlet>` pre children.

## Programová navigácia
- Injektujte `Router` a použite:
  ```ts
  router.navigate(['/users', userId, 'tasks']);
  router.navigateByUrl('/users/U2/tasks');
  ```
- Možnosti:
  - `relativeTo`, `queryParams`, `fragment`, `replaceUrl`, `state`, atď.

## Not Found & Presmerovania
- Catch-all route:
  ```ts
  { path: '**', component: NotFoundComponent }
  ```
- Presmerovanie:
  ```ts
  { path: '', redirectTo: 'tasks', pathMatch: 'full' }
  ```

## ActivatedRoute & Snapshot
- Prístup k parametrom:
  ```ts
  constructor(private route: ActivatedRoute) {}
  ngOnInit() {
    const userId = this.route.snapshot.paramMap.get('userId');
  }
  ```
- Použite snapshot pre statický prístup, subscribe pre dynamické zmeny.

## Query parametre
- Pridanie query parametrov:
  ```html
  <a [routerLink]="['.']" [queryParams]="{ order: 'asc' }">Zoradiť</a>
  ```
- Čítanie v komponente:
  ```ts
  @Input() order?: string;
  // alebo
  this.route.queryParams.subscribe(params => { ... });
  ```

## Statické dáta
- Pridanie statických dát do route:
  ```ts
  { path: 'tasks', component: TasksComponent, data: { message: 'Ahoj!' } }
  ```
- Dostupné ako input pri použití `withComponentInputBinding`.

## Resolvers
- Predčítanie dát pred aktiváciou route:
  ```ts
  { path: 'tasks', component: TasksComponent, resolve: { tasks: tasksResolver } }
  ```
- Resolver je funkcia:
  ```ts
  const tasksResolver: ResolveFn<Tasks[]> = (route, state) => ...;
  ```
- Použite `runGuardsAndResolvers: 'paramsOrQueryParamsChange'` pre reaktivitu.

## Titulky (Titles)
- Statický title:
  ```ts
  { path: 'tasks', component: TasksComponent, title: 'Úlohy' }
  ```
- Dynamický title:
  ```ts
  { path: 'tasks/:id', component: TasksComponent, title: titleResolver }
  ```

## Guards (Stráže)
- Typy: `canMatch`, `canActivate`, `canActivateChild`, `canDeactivate`
- Príklad `canMatch` guard:
  ```ts
  const myGuard: CanMatchFn = (route, segments) => true | false | RedirectCommand;
  ```

---

## Rýchla referencia
- **Router Setup:** `provideRouter(routes)`
- **Outlet:** `<router-outlet>`
- **Navigácia:** `[routerLink]`, `router.navigate()`
- **Dynamické parametre:** `:param`, `@Input()`
- **Vnorené Routes:** `children: []`, vnorený `<router-outlet>`
- **Resolvers:** `resolve: { ... }`, `runGuardsAndResolvers`
- **Guards:** `canMatch`, `canActivate`, atď.
- **Titulky:** `title: '...'` alebo resolver
- **Not Found:** `{ path: '**', ... }`
- **Presmerovanie:** `{ path: '', redirectTo: '...', pathMatch: 'full' }`
