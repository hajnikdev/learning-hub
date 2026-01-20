
## Angular Testing Cheatsheet

### Základné pojmy

- **Testovanie v Angulari:** Zaisťuje správnosť logiky, zachytáva chyby včas, umožňuje bezpečný refaktor, zvyšuje kvalitu kódu.
- **Unit testy:** Testujú izolovanú logiku (komponenty, služby, pipes, direktívy, signály, business logiku).
- **Integračné testy:** Overujú spoluprácu viacerých častí (komponent + služba, komponent + HttpClient, atď.).
- **E2E testy:** Testujú celú aplikáciu z pohľadu používateľa (reálny prehliadač, reálny build).
- **Snapshot testy:** Zachytávajú a porovnávajú renderovaný výstup na detekciu regresií UI.

---

### Legacy vs Moderné testovanie

- **Legacy:** Karma (runner) + Jasmine (framework)
  - Pomalé, beží v prehliadači, zložitá konfigurácia, slabý developer experience
- **Moderné:** Vitest (odporúčané od Angular 16+)
  - Rýchle, beží v Node.js, jednoduchá konfigurácia, výborný DX, plná podpora TypeScriptu

---

### Vitest v Angulari

- **Vitest nahrádza Karma/Jasmine, NIE Angular TestBed.**
- Stále používajte `TestBed` na Angular kontext, DI, komponenty, služby.
- Používajte Vitest na `describe`, `it`, `expect`, mockovanie (`vi.fn()`, `vi.spyOn()`).

```
        ▲  E2E testy (node, Playwright)
       ▲▲  Integračné testy (Vitest)
     ▲▲▲▲  Unit testy (Vitest)

- Čím nižšie v pyramíde, tým viac testov
- Čím vyššie, tým pomalšie a drahšie testy
```

### Unit testy (Vitest)

- Testuje jednu izolovanú jednotku (služba, komponent, funkcia).
- Veľmi rýchle, bez reálneho backendu/prehliadača, jednoduchá údržba.
- Príklady:
  - Služba počíta hodnotu
  - Komponent reaguje na klik
  - Signal sa aktualizuje

---

### Integračné testy (Vitest + Angular)

- Overujú spoluprácu (komponent + služba, komponent + HttpClient, atď.).
- Použite `TestBed.configureTestingModule` s imports/providers.
- Bez reálneho backendu/prehliadača.
- Príklad:
  ```ts
  TestBed.configureTestingModule({
    imports: [UserComponent],
    providers: [provideHttpClient(), provideHttpClientTesting()],
  });
  ```

---

### E2E testy (Playwright)

- Testuje celú aplikáciu v reálnom prehliadači.
- Testuje login, navigáciu, formuláre, kľúčové flow.
- Príklad:
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

---

### Snapshot testovanie (Vitest)

- Použite toMatchSnapshot() na porovnanie renderovaného výstupu.
- Prvé spustenie vytvorí snapshot, ďalšie porovnávajú.
- Príklad:
  ```ts
  expect(container).toMatchSnapshot();
  ```
- Použite `@testing-library/angular` na renderovanie komponentov.
- Inštalácia:
  ```bash
  npm install -D @testing-library/angular @testing-library/user-event
  ```
- Príklad:

  ```ts
  import { render } from '@testing-library/angular';
  import { CounterComponent } from './counter.component';
  import { CounterService } from '../services/counter.service';
  import { describe, it, expect } from 'vitest';

  describe('CounterComponent snapshot', () => {
    it('zodpovedá počiatočnému renderu', async () => {
      const { container } = await render(CounterComponent, {
        providers: [CounterService],
      });
      expect(container).toMatchSnapshot();
    });
  });
  ```

---

### Kľúčové API & nástroje

- **TestBed:** Angular kontext pre testy
- **Vitest:** Test runner/framework (`describe`, `it`, `expect`)
- **Mockovanie:** `vi.fn()`, `vi.spyOn()`
- **Playwright:** E2E testovanie
- **@testing-library/angular:** DOM rendering pre snapshot/UI testy

---

### Rýchly prehľad

- **Unit test:** Izolovaná logika, rýchle, bez reálneho backendu/prehliadača
- **Integračný test:** Spolupráca, použite TestBed, mockujte závislosti
- **E2E test:** Reálny prehliadač, testujte používateľské flow, použite Playwright
- **Snapshot test:** Porovnanie renderovaného výstupu, použite toMatchSnapshot()
- **Mockovanie:** Použite Vitest vi.fn(), vi.spyOn()
- **TestBed:** Pre Angular DI/kontext
- **Spustenie testov:** `npm test` (Vitest)
- **Inštalácia nástrojov:**
  - `npm install -D vitest @testing-library/angular @testing-library/user-event playwright`

---

### Užitočné odkazy

- [Angular Testing Docs](https://angular.dev/guide/testing)
- [Vitest Docs](https://vitest.dev/)
- [Playwright Docs](https://playwright.dev/)
- [Testing Library Angular](https://testing-library.com/docs/angular-testing-library/intro/)
