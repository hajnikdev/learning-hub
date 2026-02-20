## Obsah

1. [Úvod do Services a Dependency Injection](article/angular-services#úvod-do-services-a-dependency-injection)
2. [Vytvorenie Service](article/angular-services#vytvorenie-service)
3. [Dependency Injection mechanizmus](article/angular-services#dependency-injection-mechanizmus)
   - [Constructor injection](article/angular-services#constructor-injection)
   - [Inject funkcia](article/angular-services#inject-function)
4. [Hierarchický systém injektorov](article/angular-services#hierarchický-systém-injektorov)
   - [Platform Injector](article/angular-services#platform-injector)
   - [Environment Injector (Root)](article/angular-services#environment-injector-root)
   - [Module Injector](article/angular-services#module-injector)
   - [Element Injector](article/angular-services#element-injector)
5. [Poskytovanie služieb](article/angular-services#poskytovanie-služieb)
   - [@Injectable decorator](article/angular-services#injectable-decorator)
   - [Poskytovanie cez bootstrapApplication](article/angular-services#poskytovanie-cez-bootstrapapplication)
   - [Poskytovanie cez providers v komponente](article/angular-services#poskytovanie-cez-providers-v-komponente)
6. [Injection Tokens](article/angular-services#injection-tokens)
   - [Vlastné injection tokens](article/angular-services#vlastné-injection-tokens)
   - [Provider objekty](article/angular-services#provider-objekty)
7. [Injektovanie nie-service hodnôt](article/angular-services#injektovanie-nie-service-hodnôt)
8. [Injektovanie služieb do iných služieb](article/angular-services#injektovanie-služieb-do-iných-služieb)
9. [Resolution Modifiers](article/angular-services#resolution-modifiers)
   - [@Optional](article/angular-services#optional)
   - [@Self](article/angular-services#self)
   - [@SkipSelf](article/angular-services#skipself)
   - [@Host](article/angular-services#host)
10. [Multi-providers](article/angular-services#multi-providers)
11. [forwardRef - Riešenie cirkulárnych závislostí](article/angular-services#forwardref-riešenie-cirkulárnych-závislostí)
12. [Lifecycle služieb a cleanup](article/angular-services#lifecycle-služieb-a-cleanup)
13. [Testovanie služieb](article/angular-services#testovanie-služieb)
14. [Services s NgModules](article/angular-services#services-s-ngmodules)
15. [Services so Signals vs bez Signals](article/angular-services#services-so-signals-vs-bez-signals)

---

## Úvod do Services a Dependency Injection

**Services** sú centralizované triedy, ktoré sa používajú na **zdieľanie logiky a dát** naprieč aplikáciou. Môžu byť injektované do komponentov, direktív alebo iných služieb.

**Dependency Injection (DI)** je mechanizmus Angularu, ktorý umožňuje komponentom, direktívam a službám požadovať závislosti, ktoré im potom Angular poskytne. Nemusíte vytvárať inštancie služieb manuálne.

### Prečo používať Services?

- **Centralizácia logiky** - logika nie je duplikovaná v rôznych komponentoch
- **Zdieľanie dát** - viacero komponentov môže pristupovať k rovnakým dátam
- **Separácia zodpovedností** - komponenty sa starajú o zobrazenie, služby o biznis logiku
- **Testovateľnosť** - ľahšie sa testujú izolované služby

---

## Vytvorenie Service

### Manuálne vytvorenie

Vytvorte súbor `tasks.service.ts`:

```typescript
import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TasksService {
  private tasks = signal<Task[]>([]);

  // Read-only signal pre komponenty
  allTasks = this.tasks.asReadonly();

  addTask(taskData: { title: string; description: string }) {
    this.tasks.update((oldTasks) => {
      const newTask: Task = {
        ...taskData,
        id: Math.random().toString(),
        status: 'open',
      };
      return [...oldTasks, newTask];
    });
  }
}
```

### CLI generovanie

```bash
ng generate service logging
# alebo skrátene
ng g s logging --skip-tests
```

### Konvencie pomenovania

- Súbor: `nazov-sluzby.service.ts`
- Trieda: `NazovSluzbyService`

---

## Dependency Injection mechanizmus

Angular má vstavaný mechanizmus **Dependency Injection**, ktorý znamená, že komponenty, direktívy a služby môžu požiadať o hodnoty (závislosti), na ktorých závisia, a Angular im ich potom poskytne.

### Constructor injection

Tradičný spôsob injektovania pomocou konstruktora:

```typescript
import { Component } from '@angular/core';
import { TasksService } from './tasks.service';

@Component({
  selector: 'app-new-task',
  template: `...`,
})
export class NewTaskComponent {
  // TypeScript shortcut - private vytvorí property automaticky
  constructor(private tasksService: TasksService) {}

  onAddTask() {
    this.tasksService.addTask({
      title: 'Nová úloha',
      description: 'Popis',
    });
  }
}
```

**Dlhšia verzia (rovnaký výsledok):**

```typescript
export class NewTaskComponent {
  tasksService: TasksService;

  constructor(tService: TasksService) {
    this.tasksService = tService;
  }
}
```

### Inject funkcia

Moderný prístup pomocou `inject()` funkcie:

```typescript
import { Component, inject } from '@angular/core';
import { TasksService } from './tasks.service';

@Component({
  selector: 'app-tasks-list',
  template: `...`,
})
export class TasksListComponent {
  private tasksService = inject(TasksService);

  tasks = this.tasksService.allTasks;
}
```

**Výhody `inject()` funkcie:**

- Čistejší kód
- Nie je potrebný constructor
- Ľahšie čitateľné

---

## Hierarchický systém injektorov

Angular má hierarchický systém injektorov, ktoré spravujú dostupné závislosti.

```
NullInjector (háže chyby ak sa nenájde provider)
    ↓
Platform Injector (pre viacero Angular aplikácií)
    ↓
Root Environment Injector (celá aplikácia)
    ↓
Module Injector (NgModules)
    ↓
Element Injector (komponenty a direktívy)
```

### Platform Injector

- Najvyššia úroveň
- Poskytuje hodnoty pre **viacero Angular aplikácií** v jednom projekte (pokročilý use-case)

### Environment Injector (Root)

- Najčastejšie používaný
- Poskytuje hodnoty pre **celú aplikáciu**
- Služby registrované s `providedIn: 'root'`

### Module Injector

- Používa sa pri NgModules
- Služby registrované v `providers` poli modulu

### Element Injector

- Priamo viazaný na komponenty a direktívy
- Každý komponent môže mať vlastný Element Injector
- Služby registrované v `providers` poli komponentu

**Vyhľadávanie závislostí:**

1. Element Injector komponentu
2. Root Environment Injector / Module Injector
3. Platform Injector
4. NullInjector (vráti chybu)

### Vizualizácia Injector Tree

V Angular DevTools môžete vidieť strom injektorov:

1. Otvorte Angular DevTools v prehliadači
2. Prejdite do záložky "Injector Tree"
3. Uvidíte všetky registrované služby pre jednotlivé injektory

---

## Poskytovanie služieb

### @Injectable decorator

**Najčastejší a odporúčaný spôsob:**

```typescript
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root', // služba dostupná v celej aplikácii
})
export class TasksService {
  // ...
}
```

**Výhody:**

- Tree-shaking - nepoužitý kód sa odstráni pri build
- Menšie bundle size
- Automatická optimalizácia

**Alternatívy pre `providedIn`:**

- `'root'` - celá aplikácia (najčastejšie)
- `'platform'` - viacero aplikácií
- `'any'` - každý lazy-loaded modul má vlastnú inštanciu

### Poskytovanie cez bootstrapApplication

V `main.ts`:

```typescript
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app';
import { TasksService } from './app/tasks.service';

bootstrapApplication(AppComponent, {
  providers: [TasksService], // shortcut
});
```

**Nevýhody:**

- Nie tree-shakeable
- Služba sa vždy zahrnie do bundle
- Neodporúča sa pre väčšinu prípadov

### Poskytovanie cez providers v komponente

```typescript
import { Component } from '@angular/core';
import { TasksService } from './tasks.service';

@Component({
  selector: 'app-tasks',
  template: `...`,
  providers: [TasksService], // len pre tento komponent a jeho deti
})
export class TasksComponent {}
```

**Dôležité:**

- Služba je dostupná **len** v tomto komponente a child komponentoch
- **Každá inštancia komponentu** dostane vlastnú inštanciu služby
- Iné komponenty nemajú prístup

**Príklad s viacerými inštanciami:**

```typescript
@Component({
  selector: 'app-root',
  template: `
    <app-tasks></app-tasks>
    <app-tasks></app-tasks>
  `,
})
export class AppComponent {}
```

Každý `<app-tasks>` má vlastnú izolovanú inštanciu `TasksService`.

---

## Injection Tokens

**Injection Token** je identifikátor pre injektovanú hodnotu. Štandardne je to názov triedy služby.

### Vlastné injection tokens

Vytvorenie vlastného tokenu:

```typescript
import { InjectionToken } from '@angular/core';

export const TASKS_SERVICE_TOKEN = new InjectionToken<TasksService>(
  'tasks-service-token', // popis pre debugging
);
```

### Provider objekty

Pod kapotou Angular vytvára provider objekty:

```typescript
// Shortcut
providers: [TasksService];

// Plná forma
providers: [
  {
    provide: TasksService, // injection token
    useClass: TasksService, // trieda ktorá sa má použiť
  },
];
```

**S vlastným tokenom:**

```typescript
// V main.ts alebo providers
{
  provide: TASKS_SERVICE_TOKEN,
  useClass: TasksService
}
```

**Injektovanie s vlastným tokenom:**

```typescript
// S inject()
private tasksService = inject(TASKS_SERVICE_TOKEN);

// S constructor a @Inject decorator
constructor(@Inject(TASKS_SERVICE_TOKEN) private tasksService: TasksService) {}
```

**Provider vlastnosti:**

- `useClass` - poskytne inštanciu triedy
- `useValue` - poskytne existujúcu hodnotu
- `useFactory` - poskytne hodnotu z funkcie
- `useExisting` - alias na existujúci provider

---

## Injektovanie nie-service hodnôt

Môžete injektovať akúkoľvek hodnotu, nielen služby.

### Príklad: Zdieľané konfiguračné hodnoty

**1. Definujte hodnotu a token:**

```typescript
// task.model.ts
export type TaskStatusOptions = Array<{
  value: 'open' | 'in-progress' | 'done';
  text: string;
  taskStatus: TaskStatus;
}>;

export const TASK_STATUS_OPTIONS = new InjectionToken<TaskStatusOptions>('task-status-options');

export const taskStatusOptions: TaskStatusOptions = [
  { value: 'open', text: 'Otvorené', taskStatus: 'open' },
  { value: 'in-progress', text: 'Prebieha', taskStatus: 'in-progress' },
  { value: 'done', text: 'Dokončené', taskStatus: 'done' },
];

export const taskStatusOptionsProvider = {
  provide: TASK_STATUS_OPTIONS,
  useValue: taskStatusOptions,
};
```

**2. Registrujte provider:**

```typescript
@Component({
  selector: 'app-tasks-list',
  providers: [taskStatusOptionsProvider],
})
export class TasksListComponent {
  taskStatusOptions = inject(TASK_STATUS_OPTIONS);
}
```

**3. Použite v template:**

```html
<select>
  @for (option of taskStatusOptions; track option.value) {
  <option [value]="option.value">{{ option.text }}</option>
  }
</select>
```

---

## Injektovanie služieb do iných služieb

Služby môžete injektovať aj do iných služieb.

```typescript
// logging.service.ts
@Injectable({
  providedIn: 'root',
})
export class LoggingService {
  log(message: string) {
    const timestamp = new Date().toLocaleTimeString();
    console.log(`[${timestamp}] ${message}`);
  }
}

// tasks.service.ts
@Injectable({
  providedIn: 'root',
})
export class TasksService {
  private loggingService = inject(LoggingService);

  addTask(taskData: { title: string; description: string }) {
    // ... pridanie úlohy
    this.loggingService.log(`Pridaná úloha: ${taskData.title}`);
  }
}
```

**Dôležité:**

- Služby majú prístup len k `EnvironmentInjector` a `ModuleInjector`
- **Nemajú prístup** k `ElementInjector`
- Preto služby poskytnuté cez `providers` v komponente nie sú dostupné v iných službách

---

## Resolution Modifiers

**Resolution modifiers** sú dekorátory, ktoré kontrolujú, ako Angular vyhľadáva závislosti v hierarchii injektorov.

### @Optional

Použite `@Optional()` keď závislosť **nemusí** existovať. Ak sa nenájde, Angular vloží `null` namiesto chyby.

```typescript
import { Optional } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class TasksService {
  constructor(
    @Optional() private logger?: LoggingService
  ) {
    if (this.logger) {
      this.logger.log('TasksService initialized');
    }
  }
}
```

**S inject() funkciou:**

```typescript
export class TasksService {
  private logger = inject(LoggingService, { optional: true });
  
  addTask(task: Task) {
    this.logger?.log('Task added');
  }
}
```

### @Self

Hľadá závislosť **len** v Element Injector aktuálneho komponentu. Ak sa nenájde, hodí chybu.

```typescript
import { Self } from '@angular/core';

@Component({
  selector: 'app-task',
  providers: [TasksService] // musí byť tu
})
export class TaskComponent {
  constructor(
    @Self() private tasksService: TasksService
  ) {}
}
```

**S inject() funkciou:**

```typescript
private tasksService = inject(TasksService, { self: true });
```

### @SkipSelf

Preskočí Element Injector aktuálneho komponentu a hľadá v **rodičovských** injektoroch.

```typescript
import { SkipSelf } from '@angular/core';

@Component({
  selector: 'app-child-task',
  providers: [TasksService] // táto inštancia sa PRESKOČÍ
})
export class ChildTaskComponent {
  constructor(
    @SkipSelf() private tasksService: TasksService // použije rodičovskú inštanciu
  ) {}
}
```

**S inject() funkciou:**

```typescript
private tasksService = inject(TasksService, { skipSelf: true });
```

### @Host

Hľadá závislosť **len** v aktuálnom komponente a jeho host elemente. Zastaví sa pred dosiahnutím parent komponentu.

```typescript
import { Host } from '@angular/core';

@Component({
  selector: 'app-task-item'
})
export class TaskItemComponent {
  constructor(
    @Host() private taskList: TaskListComponent // musí byť host komponent
  ) {}
}
```

**S inject() funkciou:**

```typescript
private taskList = inject(TaskListComponent, { host: true });
```

**Kombinácia modifiers:**

```typescript
constructor(
  @Optional() @SkipSelf() private parentLogger?: LoggingService
) {}

// alebo
private parentLogger = inject(LoggingService, { 
  optional: true, 
  skipSelf: true 
});
```

---

## Multi-providers

**Multi-providers** umožňujú registrovať **viacero hodnôt** pre jeden injection token. Angular ich vráti ako **pole**.

### Use-case: Plugin systém

```typescript
// plugin.token.ts
export interface Plugin {
  name: string;
  execute(): void;
}

export const PLUGIN_TOKEN = new InjectionToken<Plugin[]>('plugins');
```

**Poskytnutie viacerých implementácií:**

```typescript
// plugin-a.ts
export const PluginA: Plugin = {
  name: 'Plugin A',
  execute() {
    console.log('Plugin A executed');
  }
};

// plugin-b.ts
export const PluginB: Plugin = {
  name: 'Plugin B',
  execute() {
    console.log('Plugin B executed');
  }
};
```

**Registrácia s `multi: true`:**

```typescript
// app.config.ts
export const appConfig: ApplicationConfig = {
  providers: [
    { provide: PLUGIN_TOKEN, useValue: PluginA, multi: true },
    { provide: PLUGIN_TOKEN, useValue: PluginB, multi: true },
    // môžete pridávať ďalšie
  ]
};
```

**Použitie:**

```typescript
@Injectable({ providedIn: 'root' })
export class PluginService {
  private plugins = inject(PLUGIN_TOKEN); // Plugin[]
  
  executeAll() {
    this.plugins.forEach(plugin => {
      console.log(`Executing ${plugin.name}`);
      plugin.execute();
    });
  }
}
```

### Praktický príklad: HTTP Interceptors

Angular používa multi-providers pre HTTP interceptory:

```typescript
export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(
      withInterceptors([authInterceptor, loggingInterceptor])
    )
  ]
};
```

---

## forwardRef - Riešenie cirkulárnych závislostí

**forwardRef** umožňuje odkazovať sa na triedu, ktorá **ešte nie je definovaná**. Používa sa pri cirkulárnych závislostiach.

### Problém: Cirkulárne závislosti

```typescript
// parent.service.ts
@Injectable({ providedIn: 'root' })
export class ParentService {
  constructor(private child: ChildService) {} // ChildService ešte neexistuje!
}

// child.service.ts
@Injectable({ providedIn: 'root' })
export class ChildService {
  constructor(private parent: ParentService) {} // ParentService už existuje
}
```

### Riešenie s forwardRef

```typescript
import { forwardRef } from '@angular/core';

// parent.service.ts
@Injectable({ providedIn: 'root' })
export class ParentService {
  constructor(
    @Inject(forwardRef(() => ChildService)) 
    private child: ChildService
  ) {}
}

// child.service.ts
@Injectable({ providedIn: 'root' })
export class ChildService {
  constructor(private parent: ParentService) {}
}
```

**S inject() funkciou:**

```typescript
export class ParentService {
  private child = inject(forwardRef(() => ChildService));
}
```

### Lepšie riešenie: Refaktoring

**Cirkulárne závislosti = code smell.** Lepšie je refaktorovať:

```typescript
// Vytvorte zdieľanú službu
@Injectable({ providedIn: 'root' })
export class SharedDataService {
  data = signal<Data>(null);
}

@Injectable({ providedIn: 'root' })
export class ParentService {
  constructor(private sharedData: SharedDataService) {}
}

@Injectable({ providedIn: 'root' })
export class ChildService {
  constructor(private sharedData: SharedDataService) {}
}
```

---

## Lifecycle služieb a cleanup

### Kedy sa služby vytvárajú?

- **`providedIn: 'root'`** - vytvorí sa pri **prvom použití** (lazy)
- **`providers: []` v module** - vytvorí sa pri **načítaní modulu**
- **`providers: []` v komponente** - vytvorí sa pri **vytvorení komponentu**

### Kedy sa služby ničia?

- **Root services** - nikdy (žijú počas celej aplikácie)
- **Module services** - pri zničení modulu (lazy-loaded)
- **Component services** - pri zničení komponentu

### DestroyRef - Moderný cleanup

**DestroyRef** (Angular 16+) poskytuje hook pre cleanup logiku:

```typescript
import { DestroyRef, Injectable, inject } from '@angular/core';

@Injectable()
export class TasksService {
  private destroyRef = inject(DestroyRef);
  
  constructor() {
    const interval = setInterval(() => {
      console.log('Polling...');
    }, 1000);
    
    // Automatický cleanup
    this.destroyRef.onDestroy(() => {
      clearInterval(interval);
      console.log('Service destroyed');
    });
  }
}
```

### takeUntilDestroyed - RxJS cleanup

Pre RxJS observables:

```typescript
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { interval } from 'rxjs';

@Injectable()
export class TasksService {
  private destroyRef = inject(DestroyRef);
  
  constructor() {
    interval(1000)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(val => console.log(val));
    // Automaticky sa unsubscribe pri destroy
  }
}
```

**V komponentoch (injection context):**

```typescript
export class TasksComponent {
  tasks$ = this.tasksService.getTasks()
    .pipe(takeUntilDestroyed()); // automaticky použije DestroyRef komponentu
}
```

### OnDestroy v službách

```typescript
import { Injectable, OnDestroy } from '@angular/core';

@Injectable()
export class TasksService implements OnDestroy {
  private subscription: Subscription;
  
  constructor() {
    this.subscription = interval(1000).subscribe();
  }
  
  ngOnDestroy() {
    this.subscription.unsubscribe();
    console.log('Service cleaned up');
  }
}
```

**Poznámka:** `ngOnDestroy` sa volá **len** pre services poskytnuté v komponente/module, **NIE** pre `providedIn: 'root'`.

---

## Testovanie služieb

### Základný test

```typescript
import { TestBed } from '@angular/core/testing';
import { TasksService } from './tasks.service';

describe('TasksService', () => {
  let service: TasksService;
  
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TasksService]
    });
    service = TestBed.inject(TasksService);
  });
  
  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  
  it('should add task', () => {
    const task = { title: 'Test', description: 'Test task' };
    service.addTask(task);
    
    expect(service.allTasks().length).toBe(1);
    expect(service.allTasks()[0].title).toBe('Test');
  });
});
```

### Testovanie so závislosťami

```typescript
import { TestBed } from '@angular/core/testing';

describe('TasksService with dependencies', () => {
  let service: TasksService;
  let loggerSpy: jasmine.SpyObj<LoggingService>;
  
  beforeEach(() => {
    const spy = jasmine.createSpyObj('LoggingService', ['log']);
    
    TestBed.configureTestingModule({
      providers: [
        TasksService,
        { provide: LoggingService, useValue: spy }
      ]
    });
    
    service = TestBed.inject(TasksService);
    loggerSpy = TestBed.inject(LoggingService) as jasmine.SpyObj<LoggingService>;
  });
  
  it('should log when adding task', () => {
    service.addTask({ title: 'Test', description: 'Test' });
    
    expect(loggerSpy.log).toHaveBeenCalledWith(
      jasmine.stringContaining('Test')
    );
  });
});
```

### Mock služba

```typescript
class MockTasksService {
  tasks = signal<Task[]>([]);
  allTasks = this.tasks.asReadonly();
  
  addTask(task: Partial<Task>) {
    this.tasks.update(tasks => [...tasks, task as Task]);
  }
}

describe('TaskComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TaskComponent],
      providers: [
        { provide: TasksService, useClass: MockTasksService }
      ]
    });
  });
  
  it('should display tasks', () => {
    const service = TestBed.inject(TasksService);
    service.addTask({ title: 'Test', description: 'Test' });
    
    const fixture = TestBed.createComponent(TaskComponent);
    fixture.detectChanges();
    
    expect(fixture.nativeElement.textContent).toContain('Test');
  });
});
```

### Testovanie HTTP služieb

```typescript
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('TasksApiService', () => {
  let service: TasksApiService;
  let httpMock: HttpTestingController;
  
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TasksApiService]
    });
    
    service = TestBed.inject(TasksApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });
  
  afterEach(() => {
    httpMock.verify(); // Overiť, že sa nezostali pending requesty
  });
  
  it('should fetch tasks', () => {
    const mockTasks = [{ id: '1', title: 'Test' }];
    
    service.getTasks().subscribe(tasks => {
      expect(tasks).toEqual(mockTasks);
    });
    
    const req = httpMock.expectOne('/api/tasks');
    expect(req.request.method).toBe('GET');
    req.flush(mockTasks);
  });
});
```

---

## Services s NgModules

Pri používaní modulov môžete registrovať služby v module:

```typescript
import { NgModule } from '@angular/core';
import { TasksService } from './tasks.service';

@NgModule({
  declarations: [TasksComponent, TasksListComponent],
  providers: [TasksService], // registrácia pre ModuleInjector
})
export class TasksModule {}
```

**V main.ts s modulmi:**

```typescript
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

platformBrowserDynamic().bootstrapModule(AppModule);
```

**Viacero modulov:**

- Providery sa zlúčia do jedného Module Injector
- Výnimka: lazy-loaded moduly majú vlastný injector

---

## Services so Signals vs bez Signals

Dependency Injection funguje rovnako bez ohľadu na to, či používate Signals alebo nie.

### So Signals

```typescript
@Injectable({ providedIn: 'root' })
export class TasksService {
  private tasks = signal<Task[]>([]);
  allTasks = this.tasks.asReadonly();

  addTask(task: Task) {
    this.tasks.update((tasks) => [...tasks, task]);
  }
}
```

### Bez Signals

```typescript
@Injectable({ providedIn: 'root' })
export class TasksService {
  private tasks: Task[] = [];

  get allTasks(): Task[] {
    return [...this.tasks]; // kópia pre ochranu
  }

  addTask(task: Task) {
    this.tasks.push(task);
  }
}
```

**Obe verzie fungujú s DI rovnako:**

```typescript
export class TasksComponent {
  private tasksService = inject(TasksService);

  // ...
}
```

---

## Zhrnutie

### Best Practices

✅ **Používajte `@Injectable({ providedIn: 'root' })`** - najčastejší prípad  
✅ **Používajte `inject()` funkciu** - moderný a čistý prístup  
✅ **Read-only signals** - ochrana dát v službách  
✅ **Injektujte služby do iných služieb** - kompozícia funkcionality  
✅ **Vlastné injection tokens** - pre pokročilé use-cases  
✅ **`@Optional()`** - pre nepovinné závislosti  
✅ **`takeUntilDestroyed()`** - automatický cleanup RxJS  
✅ **Multi-providers** - pre plugin systémy  
✅ **Testovanie** - vždy testujte služby v izolácii  

❌ **Nepoužívajte** manuálne inštancie služieb (`new TasksService()`)  
❌ **Vyhýbajte sa** poskytovaniu cez `bootstrapApplication` providers  
❌ **Pozor** na Element Injector - každá inštancia komponentu = nová inštancia služby  
❌ **Vyhýbajte sa** cirkulárnym závisloste - refaktorujte kód  
❌ **Nezabúdajte** na cleanup - pamäťové úniky pri subscriptions
- **Hierarchia injektorov** = Platform → Root → Module → Element
- **Injection tokens** = identifikátory pre injektované hodnoty
- **Tree-shaking** = optimalizácia cez `providedIn: 'root'`
- **Resolution modifiers** = kontrola vyhľadávania závislostí (@Optional, @Self, @SkipSelf, @Host)
- **Multi-providers** = viacero implementácií jedného tokenu
- **forwardRef** = riešenie cirkulárnych závislostí
- **DestroyRef** = moderný cleanup mechanizmus
- **Lifecycle** = root services žijú navždy, component services sa ničia s komponentom

### Pokročilé techniky

**Lazy služby:**
```typescript
// Služba sa vytvorí až pri prvom použití
@Injectable({ providedIn: 'root' })
export class LazyService {}
```

**Factory provider s dependencies:**
```typescript
export function tasksServiceFactory(
  http: HttpClient,
  config: AppConfig
) {
  return new TasksService(http, config.apiUrl);
}

providers: [
  {
    provide: TasksService,
    useFactory: tasksServiceFactory,
    deps: [HttpClient, AppConfig]
  }
]
```

**Vlastný environment injector:**
```typescript
const injector = Injector.create({
  providers: [
    { provide: TasksService, useClass: TasksService }
  ],
  parent: parentInjector
});

const service = injector.get(TasksService);
```
