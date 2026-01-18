Angular applikácie sú typicky [SPA](article/angular-routing#--spa-single-page-application) aplikácie. Často však chceme mať akoby **viacero stránok**. Chcete **jeden HTML súbor** (src/index.html), ktorý načíta Angular aplikáciu. No akonáhle je aplikácia spustená v prehliadači návštevníka webu, chceme mu dať **ilúziu prepínania medzi rôznymi stránkami**.

Routing znamená, že chceme aktualizovať používateľské rozhranie podľa toho, ako sa používateľ pohybuje po vašej webovej stránke.

Zvyčajne chcete tiež aktualizovať adresný riadok v prehliadači, aby bolo možné zdieľať odkazy na rôzne časti vášho webu.

Angular umožňuje implementovať routing na strane klienta, takže samotný framework Angular sa stará o aktualizáciu URL adresy, jej čítanie a o načítavanie rôznych komponentov v závislosti od aktuálne aktívnej URL.

Prepínanie medzi rôznymi stránkami by nemalo byť riadené zmenou stavu a podmieneným renderovaním obsahu. Namiesto toho to musíme robiť tým, že načítame inú URL, aby sa zmenila adresa v adresnom riadku, a zobrazíme rôzne komponenty na obrazovke podľa URL.

---

## Implementácia routingu

- V `main.ts` poskytnúť [konfiguračný objekt](article/angular-routing#--konfiguračný-objekt-bootstrapapplication) ako druhý argument pre `bootstrapApplication`.
- V druhom argumente:
  - nastaviť `providers`
  - zavolať `provideRouter` (import z `@angular/router`)
- `provideRouter` poskytuje **router provider** nakonfigurovaný Angularom.
- Tento router provider sa odovzdáva do poľa providerov.
- Ak používate modulovú aplikáciu s `AppModule` namiesto `bootstrapApplication`:
  - Funguje to rovnako
  - Zavoláte `provideRouter` a pridáte ho do poľa providerov v module
- `provideRouter` očakáva **pole rout**, aby Angular vedel, ktoré routy podporovať
- **Route** = kombinácia URL cesty + komponentu, ktorý sa má aktivovať a načítať
  - Napr.: cesta `tasks` → komponent `TasksComponent`
  - Komponent sa importuje a nastaví ako aktívny pre danú route
- Pre väčšie projekty je bežné routy **outsourcovať** do samostatného súboru:
  - Súbor `app.routes.ts` vedľa komponentu `app`
  - Exportovať konštantu `routes` typu `Routes` (import z `@angular/router`)
  - Importovať všetky potrebné komponenty
- V `main.ts` potom:
  - Importovať `routes`
  - Odovzdať do `provideRouter`
- Podobne je možné outsourcovať **konfiguračný objekt**:
  - Súbor `app.config.ts`
  - Exportovať `appConfig` typu `ApplicationConfig` (import z `@angular/core`)
- V `main.ts`:
  - Importovať `provideRouter`, routy a konfiguračný objekt
  - Vyčistiť nepoužité importy → čistý `main.ts`
- **Konvencie**, nie povinnosť – udržiavajú súbory prehľadné
- Routing je teraz **povolený** a môžete pridávať ďalšie routy

---

#### - Konfiguračný objekt bootstrapApplication

Konfiguračný objekt pre `bootstrapApplication` je objekt typu `ApplicationConfig`, ktorý umožňuje nastaviť poskytovateľov (providers), smerovanie (routing), importy modulov a ďalšie konfigurácie pri spúšťaní Angular aplikácie.

```ts
const appConfig = {
  providers: [provideRouter([{ path: 'tasks', component: TasksComponent }])],
};

bootstrapApplication(AppComponent, appConfig);
```

#### - SPA (Single Page Application)

SPA je webová aplikácia, ktorá načíta jeden HTML dokument a následne dynamicky mení obsah stránky pomocou JavaScriptu bez potreby jej opätovného načítania.
