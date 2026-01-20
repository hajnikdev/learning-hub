## Obsah

- [Zakladné informácie](article/angular-testing#zakladné-informácie)
- [Krátka história Angular testovania](article/angular-testing#krátka-história-angular-testovania)
  - [Tradičný prístup (legacy)](article/angular-testing#tradičný-prístup-legacy)
  - [Moderný prístup: Vitest](article/angular-testing#moderný-prístup-vitest)
- [Čo je Vitest?](article/angular-testing#čo-je-vitest)
- [Prečo je Vitest lepší pre Angular?](article/angular-testing#prečo-je-vitest-lepší-pre-angular)
- [Čo znamená „Angular testing s Vitest“?](article/angular-testing#čo-znamená-angular-testing-s-vitest)
- [Čo testujeme v Angulari?](article/angular-testing#čo-testujeme-v-angulari)
  - [Typy testov v Angular projekte, Testovacia pyramída](article/angular-testing#typy-testov-v-angular-projekte-testovacia-pyramída)
- [1️. Unit testy (Vitest)](article/angular-testing#1️-unit-testy-vitest)
  - [Čo sú unit testy?](article/angular-testing#čo-sú-unit-testy)
  - [Vlastnosti unit testov](article/angular-testing#vlastnosti-unit-testov)
  - [Príklady unit testov](article/angular-testing#príklady-unit-testov)
- [2️. Integračné testy (Vitest + Angular)](article/angular-testing#2️-integračné-testy-vitest--angular)
  - [Čo sú integračné testy?](article/angular-testing#čo-sú-integračné-testy)
  - [Príklad integračného testu](article/angular-testing#príklad-integračného-testu)
  - [Rozdiel: unit vs integračný test](article/angular-testing#rozdiel-unit-vs-integračný-test)
- [3️. E2E testy (Playwright)](article/angular-testing#3️-e2e-testy-playwright)
  - [Čo sú E2E testy?](article/angular-testing#čo-sú-e2e-testy)
  - [Čo testujeme pomocou E2E?](article/angular-testing#čo-testujeme-pomocou-e2e)
  - [Prečo Playwright?](article/angular-testing#prečo-playwright)
  - [Ukážka E2E testu (Playwright)](article/angular-testing#ukážka-e2e-testu-playwright)
- [Snapshot testovanie](article/angular-testing#snapshot-testovanie)
  - [Príklad snapshot testu pre CounterComponent](article/angular-testing#príklad-snapshot-testu-pre-countercomponent)
  - [Ako to funguje](article/angular-testing#ako-to-funguje)
  - [Spustenie snapshot testov](article/angular-testing#spustenie-snapshot-testov)

## Zakladné informácie

Testovanie je neoddeliteľnou súčasťou moderného vývoja webových aplikácií. V Angulari nám **unit testy** pomáhajú:

- overiť správnosť logiky komponentov a služieb
- zachytiť chyby včas (ešte pred nasadením)
- refaktorovať kód bez strachu
- zlepšiť kvalitu a udržateľnosť aplikácie

Cieľom unit testov **nie je** otestovať celý Angular framework, ale **našu vlastnú logiku**.

---

## Krátka história Angular testovania

### Tradičný prístup (legacy)

Dlhé roky Angular používal:

- **Karma** ako test runner
- **Jasmine** ako testovací framework

Nevýhody:

- pomalé testy (spúšťané v prehliadači)
- komplikovaná konfigurácia
- horší developer experience

---

### Moderný prístup: Vitest

Od Angular 16+ sa odporúča používať **Vitest**.

## Čo je Vitest?

Vitest je moderný testovací framework:

- beží v Node.js (nie v prehliadači)
- je extrémne rýchly
- má API podobné Jestu
- má výbornú podporu pre TypeScript

Angular ho dnes považuje za **preferované riešenie** pre unit testy.

---

## Prečo je Vitest lepší pre Angular?

| Vlastnosť                 | Karma      | Vitest       |
| ------------------------- | ---------- | ------------ |
| Rýchlosť                  | Pomalšia   | Veľmi rýchla |
| Spustenie                 | Prehliadač | Node.js      |
| Konfigurácia              | Zložitá    | Jednoduchá   |
| DX (Developer Experience) | Slabší     | Výborný      |
| Moderné Angular API       | Obmedzené  | Plná podpora |

---

## Čo znamená „Angular testing s Vitest“?

Dôležité je pochopiť jednu vec:

> **Vitest nenahrádza Angular TestBed.**  
> Vitest nahrádza **Karma a Jasmine**.

Stále používame:

- `TestBed` na vytváranie Angular kontextu
- Angular DI (Dependency Injection)
- Angular komponenty, služby, signály

Ale:

- `describe`, `it`, `expect` pochádzajú z **Vitest**
- mockovanie robíme pomocou `vi.fn()`, `vi.spyOn()`

---

## Čo testujeme v Angulari?

V unit testoch sa zameriavame na:

- **Komponenty**
- **Služby**
- **Pipe**
- **Directive**
- **Signály**
- **Business logiku**

Netestujeme:

- HTML/CSS detaily
- Angular interné mechanizmy
- Routing správanie (to patrí do E2E testov)

---

### Typy testov v Angular projekte, Testovacia pyramída

Predtým než začneme písať testy, musíme pochopiť **testovaciu pyramídu**.

```
        ▲  E2E testy (node, Playwright)
       ▲▲  Integračné testy (Vitest)
     ▲▲▲▲  Unit testy (Vitest)

- Čím nižšie v pyramíde, tým viac testov
- Čím vyššie, tým pomalšie a drahšie testy
```

## 1️. Unit testy (Vitest)

### Čo sú unit testy?

Unit testy testujú **jednu izolovanú jednotku logiky**.

Typicky:

- jedna služba
- jeden komponent (bez reálnych závislostí)
- jedna funkcia

### Vlastnosti unit testov

- veľmi rýchle
- bez reálneho backendu
- bez prehliadača
- jednoduché na údržbu

### Príklady unit testov

- služba správne počíta hodnotu
- komponent reaguje na klik
- signal sa aktualizuje

## 2️. Integračné testy (Vitest + Angular)

### Čo sú integračné testy?

Integračné testy overujú **spoluprácu viacerých častí aplikácie**.

Testujeme:

- komponent + služba
- komponent + HttpClient (mockovaný)
- viac komponentov spolu
- formulár + validácie + service

Stále **nepoužívame reálny backend**  
Stále **nepoužívame reálny prehliadač**

### Príklad integračného testu

Testujeme:

- komponent
- službu
- HTTP volanie (mock)

```ts
TestBed.configureTestingModule({
  imports: [UserComponent],
  providers: [provideHttpClient(), provideHttpClientTesting()],
});
```

Integračný test odpovedá na otázku:

> „Fungujú tieto časti spolu správne?“

### Rozdiel: unit vs integračný test

| Otázka               | Unit test    | Integračný test |
| -------------------- | ------------ | --------------- |
| Testuje jednu triedu | Áno          | Nie             |
| Testuje spoluprácu   | Nie          | Áno             |
| Používa TestBed      | Niekedy      | Takmer vždy     |
| Rýchlosť             | Veľmi rýchly | Rýchly          |

---

## 3️. E2E testy (Playwright)

### Čo sú E2E testy?

E2E (End to End) testy testujú **celú aplikáciu z pohľadu používateľa**.

Používajú:

- reálny prehliadač
- reálny build aplikácie
- reálne používateľské akcie

### Čo testujeme pomocou E2E?

- prihlasovanie
- navigáciu
- formuláre
- kritické používateľské scenáre

Netestujeme každé tlačidlo, iba **kľúčové flow**

### Prečo Playwright?

Angular dnes oficiálne odporúča **Playwright**.

Výhody:

- rýchly
- stabilný
- podporuje Chromium, Firefox, WebKit
- výborný dizajn API
- screenshoty a video pri zlyhaní testu

### Ukážka E2E testu (Playwright)

```ts
import { test, expect } from '@playwright/test';

test('user can login', async ({ page }) => {
  await page.goto('/login');

  await page.fill('input[name="email"]', 'test@test.com');
  await page.fill('input[name="password"]', 'password');

  await page.click('button[type="submit"]');

  await expect(page).toHaveURL('/dashboard');
});
```

Tento test simuluje **reálneho používateľa**.

## Snapshot testovanie

Snapshot testovanie je spôsob, ako zachytiť výstup renderovanej komponenty (HTML, JSON alebo akúkoľvek serializovateľnú hodnotu) v danom momente a automaticky ho porovnať pri ďalších spusteniach testov.

- Pri prvom spustení sa vytvorí “snapshot” (snímka).
- Pri ďalších spusteniach sa aktuálny výstup porovná s uloženým snapshotom.
- Ak sa výstup neočakávane zmení, test zlyhá.

> Snapshot testovanie sa používa na kontrolu regresie UI a overenie, že zložité komponenty so signálmi alebo vstupmi nezmenili neočakávane svoj výstup, pričom nenahrádza funkčné testy.

Vo Vitest sa používa:

```ts
expect(hodnota).toMatchSnapshot();
```

### Príklad snapshot testu pre CounterComponent

Na snapshot testovanie komponenty použijeme `@testing-library/angular`, aby sme renderovali jej DOM a porovnali s uloženým snapshotom.

```bash
npm install -D @testing-library/angular @testing-library/user-event
```

```ts
import { render } from '@testing-library/angular';
import { CounterComponent } from './counter.component';
import { CounterService } from '../services/counter.service';
import { describe, it, expect } from 'vitest';

describe('CounterComponent snapshot testy', () => {
  it('zodpovedá počiatočnému renderu', async () => {
    const { container } = await render(CounterComponent, {
      providers: [CounterService],
    });

    expect(container).toMatchSnapshot();
  });

  it('zodpovedá po kliknutí na "+"', async () => {
    const { container, getByText } = await render(CounterComponent, {
      providers: [CounterService],
    });

    getByText('+').click(); // klik na tlačidlo increment

    expect(container).toMatchSnapshot();
  });

  it('zodpovedá po kliknutí na "Reset"', async () => {
    const { container, getByText } = await render(CounterComponent, {
      providers: [CounterService],
    });

    const incrementButton = getByText('+');
    const resetButton = getByText('Reset');

    incrementButton.click(); // 0 → 1
    resetButton.click(); // 1 → 0

    expect(container).toMatchSnapshot();
  });
});
```

### Ako to funguje

1. `container` obsahuje **renderovaný DOM komponenty**.
2. `toMatchSnapshot()` uloží HTML do `.snap` súboru.
3. Pri ďalších spusteniach:
   - ak sa DOM nezmení → test prejde
   - ak sa DOM zmení → test zlyhá → upozornenie na regresiu UI
