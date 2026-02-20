## Základné pojmy
- **Service:** Trieda na zdieľanie logiky a dát naprieč aplikáciou.
- **Dependency Injection (DI):** Mechanizmus, ktorým Angular poskytuje závislosti komponentom, direktívam a službám.
- **Injection Token:** Identifikátor pre injektovanú hodnotu (štandardne názov triedy).
- **Injector:** Objekt, ktorý spravuje dostupné závislosti v hierarchii.

## Vytvorenie služby
- Manuálne vytvorenie:
  ```ts
  @Injectable({ providedIn: 'root' })
  export class TasksService {
    private tasks = signal<Task[]>([]);
    allTasks = this.tasks.asReadonly();
  }
  ```
- CLI generovanie:
  ```bash
  ng generate service tasks
  ng g s tasks --skip-tests
  ```
- Konvencia: `nazov.service.ts`, trieda `NazovService`

## Injektovanie

### Constructor injection
```ts
constructor(private tasksService: TasksService) {}
```

### Inject() funkcia (odporúčané)
```ts
private tasksService = inject(TasksService);
```

## Poskytovanie služieb

### @Injectable decorator (najčastejšie)
```ts
@Injectable({ providedIn: 'root' })
export class TasksService {}
```
- **Výhoda:** Tree-shakeable, menší bundle size

### V bootstrapApplication
```ts
bootstrapApplication(AppComponent, {
  providers: [TasksService]
});
```
- **Nevýhoda:** Nie tree-shakeable

### V komponente
```ts
@Component({
  selector: 'app-tasks',
  providers: [TasksService]
})
export class TasksComponent {}
```
- Služba dostupná len v komponente a child komponentoch
- Každá inštancia komponentu = nová inštancia služby

## Hierarchia injektorov
```
NullInjector (háže chyby)
    ↓
Platform Injector (viacero Angular apps)
    ↓
Root Environment Injector (celá aplikácia)
    ↓
Module Injector (NgModules)
    ↓
Element Injector (komponenty, direktívy)
```
- Vyhľadávanie ide odo dna nahor
- Služby majú prístup len k Environment/Module Injector (nie Element)

## Injection Tokens

### Vlastný token
```ts
export const TASKS_TOKEN = new InjectionToken<TasksService>(
  'tasks-service'
);
```

### Provider objekt
```ts
// Shortcut
providers: [TasksService]

// Plná forma
providers: [
  { provide: TasksService, useClass: TasksService }
]

// S vlastným tokenom
providers: [
  { provide: TASKS_TOKEN, useClass: TasksService }
]
```

### Injektovanie s tokenom
```ts
// inject()
private service = inject(TASKS_TOKEN);

// constructor
constructor(@Inject(TASKS_TOKEN) private service: TasksService) {}
```

## Provider vlastnosti
- **useClass:** Poskytne inštanciu triedy
- **useValue:** Poskytne existujúcu hodnotu
- **useFactory:** Poskytne hodnotu z funkcie
- **useExisting:** Alias na existujúci provider

## Injektovanie nie-service hodnôt

### Definícia hodnoty a tokenu
```ts
export type TaskOptions = Array<{ value: string; text: string }>;

export const TASK_OPTIONS = new InjectionToken<TaskOptions>(
  'task-options'
);

export const taskOptions: TaskOptions = [
  { value: 'open', text: 'Otvorené' },
  { value: 'done', text: 'Dokončené' }
];

export const taskOptionsProvider = {
  provide: TASK_OPTIONS,
  useValue: taskOptions
};
```

### Registrácia
```ts
@Component({
  providers: [taskOptionsProvider]
})
```

### Použitie
```ts
private options = inject(TASK_OPTIONS);
```

## Služby v službách
```ts
@Injectable({ providedIn: 'root' })
export class TasksService {
  private logger = inject(LoggingService);
  
  addTask(task: Task) {
    // ...
    this.logger.log('Task added');
  }
}
```
- Služba musí byť poskytnutá cez Environment/Module Injector
- **Nie** cez Element Injector (providers v komponente)

## Services so Signals

### So Signals
```ts
@Injectable({ providedIn: 'root' })
export class TasksService {
  private tasks = signal<Task[]>([]);
  allTasks = this.tasks.asReadonly(); // Read-only
  
  addTask(task: Task) {
    this.tasks.update(tasks => [...tasks, task]);
  }
}
```

### Bez Signals
```ts
@Injectable({ providedIn: 'root' })
export class TasksService {
  private tasks: Task[] = [];
  
  get allTasks(): Task[] {
    return [...this.tasks]; // Kópia
  }
  
  addTask(task: Task) {
    this.tasks.push(task);
  }
}
```

## NgModules
```ts
@NgModule({
  providers: [TasksService]
})
export class TasksModule {}

// main.ts
platformBrowserDynamic().bootstrapModule(AppModule);
```

## Resolution Modifiers

### @Optional
```ts
// Constructor
constructor(@Optional() private logger?: LoggingService) {}

// inject()
private logger = inject(LoggingService, { optional: true });
```
- Ak sa nenájde, vloží `null` namiesto chyby

### @Self
```ts
// Hľadá LEN v Element Injector komponentu
private service = inject(TasksService, { self: true });
```

### @SkipSelf
```ts
// Preskočí Element Injector, hľadá v rodičovských
private service = inject(TasksService, { skipSelf: true });
```

### @Host
```ts
// Hľadá len v aktuálnom komponente a jeho hoste
private parent = inject(ParentComponent, { host: true });
```

### Kombinácia
```ts
private logger = inject(LoggingService, { 
  optional: true, 
  skipSelf: true 
});
```

## Multi-providers
```ts
// Definícia tokenu
export const PLUGIN_TOKEN = new InjectionToken<Plugin[]>('plugins');

// Registrácia (multi: true)
providers: [
  { provide: PLUGIN_TOKEN, useValue: PluginA, multi: true },
  { provide: PLUGIN_TOKEN, useValue: PluginB, multi: true }
]

// Použitie (vráti pole)
private plugins = inject(PLUGIN_TOKEN); // Plugin[]
```
- Angular vráti **pole** všetkých hodnôt
- Použitie: HTTP interceptory, plugin systémy

## forwardRef
```ts
// Riešenie cirkulárnych závislostí
@Injectable({ providedIn: 'root' })
export class ParentService {
  private child = inject(forwardRef(() => ChildService));
}
```
- **Lepšie:** Refaktoruj na zdieľanú službu
- Cirkulárne závislosti = code smell

## Lifecycle a Cleanup

### DestroyRef (Angular 16+)
```ts
@Injectable()
export class TasksService {
  private destroyRef = inject(DestroyRef);
  
  constructor() {
    const timer = setInterval(() => {}, 1000);
    
    this.destroyRef.onDestroy(() => {
      clearInterval(timer);
    });
  }
}
```

### takeUntilDestroyed (RxJS)
```ts
// V službe
constructor() {
  interval(1000)
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe();
}

// V komponente (automaticky použije DestroyRef)
tasks$ = this.service.getTasks()
  .pipe(takeUntilDestroyed());
```

### OnDestroy
```ts
@Injectable()
export class TasksService implements OnDestroy {
  ngOnDestroy() {
    // Cleanup
  }
}
```
- Volá sa **len** pre services v komponente/module
- **NIE** pre `providedIn: 'root'`

### Kedy sa vytvárajú/ničia?
- `providedIn: 'root'` → Lazy (pri prvom použití), nikdy sa neničia
- `providers: []` v module → Pri načítaní modulu, ničia sa s modulom
- `providers: []` v komponente → Pri vytvorení komponentu, ničia sa s komponentom

## Testovanie

### Základný test
```ts
describe('TasksService', () => {
  let service: TasksService;
  
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TasksService]
    });
    service = TestBed.inject(TasksService);
  });
  
  it('should add task', () => {
    service.addTask({ title: 'Test' });
    expect(service.allTasks().length).toBe(1);
  });
});
```

### Mock závislostí
```ts
beforeEach(() => {
  const loggerSpy = jasmine.createSpyObj('LoggingService', ['log']);
  
  TestBed.configureTestingModule({
    providers: [
      TasksService,
      { provide: LoggingService, useValue: loggerSpy }
    ]
  });
});
```

### HTTP testovanie
```ts
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

beforeEach(() => {
  TestBed.configureTestingModule({
    imports: [HttpClientTestingModule],
    providers: [TasksApiService]
  });
  
  httpMock = TestBed.inject(HttpTestingController);
});

it('should fetch tasks', () => {
  service.getTasks().subscribe(tasks => {
    expect(tasks).toEqual(mockTasks);
  });
  
  const req = httpMock.expectOne('/api/tasks');
  req.flush(mockTasks);
});
```

## Best Practices
✅ Používaj `@Injectable({ providedIn: 'root' })`  
✅ Používaj `inject()` funkciu  
✅ Read-only signals pre ochranu dát  
✅ Injektuj služby do služieb  
✅ Vlastné tokeny pre pokročilé use-cases  
✅ `@Optional()` pre nepovinné závislosti  
✅ `takeUntilDestroyed()` pre automatický cleanup RxJS  
✅ Multi-providers pre plugin systémy  
✅ Vždy testuj služby v izolácii  

❌ Nevytváraj inštancie manuálne (`new Service()`)  
❌ Vyhýbaj sa `bootstrapApplication` providers  
❌ Pozor na Element Injector pri službách v službách  
❌ Vyhýbaj sa cirkulárnym závisloste - refaktoruj  
❌ Nezabúdaj na cleanup - riziko memory leaks  

---

## Rýchly prehľad
- **Vytvorenie:** `ng g s nazov`, `@Injectable({ providedIn: 'root' })`
- **Injektovanie:** `inject(Service)` alebo `constructor(private s: Service)`
- **Poskytovanie:** `providedIn: 'root'`, `providers: []`
- **Hierarchia:** Platform → Root → Module → Element
- **Tokens:** `InjectionToken<T>()`, `@Inject(TOKEN)`
- **Provider typy:** `useClass`, `useValue`, `useFactory`, `useExisting`
- **Resolution modifiers:** `@Optional`, `@Self`, `@SkipSelf`, `@Host`
- **Multi-providers:** `{ provide: TOKEN, useValue: X, multi: true }`
- **forwardRef:** Cirkulárne závislosti (lepšie refaktorovať)
- **Cleanup:** `DestroyRef`, `takeUntilDestroyed()`, `OnDestroy`
- **Testovanie:** `TestBed`, `HttpClientTestingModule`, spy objekty
- **Signals:** `signal()`, `asReadonly()`, `update()`
- **NgModules:** `providers: []` v `@NgModule`