
# Angular Change Detection – Cheatsheet

## Kľúčové pojmy
- **Change Detection**: Automatická aktualizácia DOM pri zmene dát.
- **Zone.js**: Sleduje asynchrónne udalosti a spúšťa detekciu zmien.
- **OnPush**: Stratégia detekcie zmien, ktorá kontroluje komponent len pri zmene vstupov, udalosti alebo signálu.
- **Signály**: Reaktívny spôsob správy dát (Angular 17+), automaticky spúšťa detekciu zmien.
- **RxJS/BehaviorSubject**: Alternatíva k signálom, vyžaduje async pipe alebo manuálnu detekciu zmien.
- **Zoneless**: Angular bez Zone.js (Angular 18+), detekcia len cez signály a eventy.

---

## Najčastejšie vzory a odporúčania

### 1. Vyhnite sa náročným výpočtom v šablónach
```typescript
// Zlá prax
get random() { return Math.random(); }
// {{ random }} // spôsobí chybu v dev móde
```

### 2. OnPush stratégia
```typescript
@Component({
	...,
	changeDetection: ChangeDetectionStrategy.OnPush
})
```

### 3. Signály
```typescript
import { signal } from '@angular/core';
count = signal(0);
increment() { count.update(c => c + 1); }
// V šablóne: {{ count() }}
```

### 4. Služba so signálom
```typescript
private messages = signal<string[]>([]);
allMessages = messages.asReadonly();
addMessage(msg: string) {
	messages.update(arr => [...arr, msg]);
}
```

### 5. Služba s RxJS
```typescript
private messages$ = new BehaviorSubject<string[]>([]);
addMessage(msg: string) {
	messages$.next([...messages$.value, msg]);
}
```

### 6. RxJS v komponente
```typescript
// Manuálne
messagesService.messages$.subscribe(msgs => {
	messages = msgs;
	cdRef.markForCheck();
});

// Elegantne s async pipe
<ul>
	<li *ngFor="let msg of messagesService.messages$ | async">{{ msg }}</li>
</ul>
```

### 7. runOutsideAngular
```typescript
zone.runOutsideAngular(() => {
	setTimeout(() => { ... }, 5000);
});
```

### 8. Zoneless Change Detection (Angular 18+)
```typescript
import { provideExperimentalZonelessChangeDetection } from '@angular/core';
bootstrapApplication(AppComponent, {
	providers: [provideExperimentalZonelessChangeDetection()]
});
```

---

## Best Practices
- Preferujte **OnPush** pre komponenty.
- Používajte **signály** na reaktívnu správu dát.
- Pri RxJS preferujte **async pipe**.
- Nepoužívajte náročné výpočty v šablónach.
- Pri vypnutí Zone.js používajte len signály a event bindingy.
