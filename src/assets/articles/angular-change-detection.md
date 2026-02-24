## Obsah

1. [Úvod do Change Detection](#úvod-do-change-detection)
2. [Ako funguje Change Detection v Angulari](#ako-funguje-change-detection-v-angulare)
3. [Optimalizácia a odporúčania](#optimalizácia-a-odporúčania)
4. [Zone.js a runOutsideAngular](#zonejs-a-runoutsideangular)
5. [OnPush stratégia](#onpush-stratégia)
6. [Signály a Change Detection](#signály-a-change-detection)
7. [Služby, OnPush a signály vs. RxJS](#služby-onpush-a-signály-vs-rxjs)
8. [RxJS, BehaviorSubject a async pipe](#rxjs-behaviorsubject-a-async-pipe)
9. [Zoneless Change Detection](#zoneless-change-detection)
10. [Zhrnutie a best practices](#zhrnutie-a-best-practices)

---

## Úvod do Change Detection

**Change Detection** (detekcia zmien) je mechanizmus Angularu, ktorý automaticky aktualizuje DOM, keď sa zmenia dáta v aplikácii. Väčšinou s ním neprichádzate priamo do kontaktu, ale je kľúčový pre správne fungovanie Angular aplikácií.

---

## Ako funguje Change Detection v Angulari

Angular obalí celý strom komponentov do tzv. *zóny* (Zone.js). Táto zóna sleduje udalosti (kliknutia, časovače, HTTP odpovede...) a keď sa niečo stane, Angular spustí detekciu zmien:

1. Prejde všetky komponenty v aplikácii.
2. Skontroluje všetky template bindingy (`{{ ... }}`, `[prop]`, atď.).
3. Ak sa hodnota zmenila, aktualizuje DOM.

**Príklad:**
```typescript
// Getter v komponente
get debugOutput() {
	console.log('Evaluated!');
	return 'Debug info';
}
// V šablóne: {{ debugOutput }}
```
Každý klik spustí detekciu zmien vo všetkých komponentoch.

**Poznámka:** V dev móde Angular spúšťa detekciu zmien dvakrát, aby odhalil nežiaduce zmeny počas cyklu (chyba `ExpressionChangedAfterItHasBeenCheckedError`).

---

## Optimalizácia a odporúčania

- **Nevkladajte náročné výpočty do šablón!**
- Getter/funkcia v šablóne by mala byť rýchla.
- Nepoužívajte náhodné hodnoty v bindingoch.
- Funkcie v šablóne volajte len ak je to nevyhnutné.

**Príklad zlej praxe:**
```typescript
get random() { return Math.random(); }
// {{ random }} // spôsobí chybu v dev móde
```

---

## Zone.js a runOutsideAngular

Zone.js sleduje všetky asynchrónne udalosti (aj časovače) a spúšťa detekciu zmien.

**Príklad:**
```typescript
import { Component, inject, NgZone } from '@angular/core';

@Component({...})
export class CounterComponent {
	private zone = inject(NgZone);

	ngOnInit() {
		// Tento časovač nespustí change detection
		this.zone.runOutsideAngular(() => {
			setTimeout(() => {
				console.log('Timer expired');
			}, 5000);
		});
	}
}
```
Používajte len ak viete, že daný kód nemá vplyv na UI.

---

## OnPush stratégia

**OnPush** je alternatívna stratégia detekcie zmien, ktorú môžete nastaviť na úrovni komponentu:

```typescript
import { ChangeDetectionStrategy } from '@angular/core';

@Component({
	...,
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class MessagesComponent {}
```

**Kedy sa komponent s OnPush kontroluje?**
- Pri zmene vstupov (`@Input`)
- Pri udalosti v komponente alebo jeho deťoch
- Pri manuálnom spustení detekcie (`ChangeDetectorRef`)
- Pri zmene signálu (Angular 17+)

**Výhoda:** Znižuje počet kontrolovaných komponentov, zvyšuje výkon.

---

## Signály a Change Detection

**Signály** (Angular 17+) sú reaktívny spôsob správy dát.

Ak zmeníte hodnotu signálu, Angular vie, že má skontrolovať komponent:
```typescript
import { signal } from '@angular/core';

export class CounterComponent {
	count = signal(0);
	increment() { this.count.update(c => c + 1); }
}
```
V šablóne: `{{ count() }}`

**Signály automaticky spúšťajú detekciu zmien aj v OnPush komponentoch.**

---

## Služby, OnPush a signály vs. RxJS

Ak zdieľate dáta medzi OnPush komponentmi cez službu:
- **So signálmi:** všetko funguje automaticky.
- **Bez signálov:** musíte manuálne spustiť detekciu zmien.

**Príklad služby so signálom:**
```typescript
import { signal } from '@angular/core';
export class MessagesService {
	private messages = signal<string[]>([]);
	allMessages = this.messages.asReadonly();
	addMessage(msg: string) {
		this.messages.update(arr => [...arr, msg]);
	}
}
```

**Príklad služby bez signálu (RxJS):**
```typescript
import { BehaviorSubject } from 'rxjs';
export class MessagesService {
	private messages$ = new BehaviorSubject<string[]>([]);
	addMessage(msg: string) {
		this.messages$.next([...this.messages$.value, msg]);
	}
}
```

---

## RxJS, BehaviorSubject a async pipe

Ak používate RxJS, v komponente nastavte subscription alebo použite `async` pipe:

**Manuálne:**
```typescript
import { ChangeDetectorRef, inject, OnInit } from '@angular/core';
import { MessagesService } from './messages.service';

export class MessagesListComponent implements OnInit {
	private cdRef = inject(ChangeDetectorRef);
	messages: string[] = [];
	ngOnInit() {
		this.messagesService.messages$.subscribe(msgs => {
			this.messages = msgs;
			this.cdRef.markForCheck();
		});
	}
}
```

**Elegantne s async pipe:**
```html
<ul>
	<li *ngFor="let msg of messagesService.messages$ | async">{{ msg }}</li>
</ul>
```

---

## Zoneless Change Detection

Od Angular 18 môžete vypnúť Zone.js a používať len signály a event bindingy:

**V angular.json odstráňte polyfill:**
```json
"polyfills": []
```

**V main.ts:**
```typescript
import { provideExperimentalZonelessChangeDetection } from '@angular/core';
bootstrapApplication(AppComponent, {
	providers: [provideExperimentalZonelessChangeDetection()]
});
```

**Pozor:** Timery a iné asynchrónne udalosti už nespustia detekciu zmien, ak neaktualizujú signál.

---

## Zhrnutie a best practices

- Preferujte **OnPush** stratégiu pre komponenty.
- Používajte **signály** na reaktívnu správu dát.
- Ak musíte použiť RxJS, preferujte **async pipe**.
- Nepoužívajte náročné výpočty v šablónach.
- Pri vypnutí Zone.js používajte len signály a event bindingy.

**Kľúčové pojmy:**
- Change Detection, Zone.js, OnPush, Signals, RxJS, BehaviorSubject, async pipe, Zoneless