## Obsah

1. [Implementácia routingu](article/angular-routing#implementácia-routingu)
2. [Zavedenie routingu do html markup (router-outlet)](article/angular-routing#zavedenie-routingu-do-html-markup-router-outlet)
3. [Navigácia medzi routami, odkazy a RouterLink](article/angular-routing#navigácia-medzi-routami-odkazy-a-routerlink)
   - [RouterLink](article/angular-routing#routerlink)
   - [RouterLinkActive](article/angular-routing#routerlinkactive)
   - [Dynamické cesty](article/angular-routing#dynamické-cesty)
   - [Vnorené cesty](article/angular-routing#vnorené-cesty)
   - [Konfigurácia child routes](article/angular-routing#konfigurácia-child-routes)
   - [Programová navigácia](article/angular-routing#programová-navigácia)
   - [Not Found (Catch-All) Route](article/angular-routing#not-found-catch-all-route)
   - [Presmerovanie (Redirect)](article/angular-routing#presmerovanie-redirect)
4. [ActivatedRoute a snapshot](article/angular-routing#activatedroute-a-snapshot)
5. [Query parametre](article/angular-routing#query-parametre)
6. [Statické data](article/angular-routing#statické-data)
7. [Resolvers (resolve)](article/angular-routing#resolvers-resolve)
   - [Resolver funkcia](article/angular-routing#resolver-funkcia)
   - [Resolvers a zmeny query parametrov](article/angular-routing#resolvers-a-zmeny-query-parametrov)
   - [Predvolené správanie resolverov](article/angular-routing#predvolené-správanie-resolverov)
8. [Dynamické a statické title pre routy v Angulari](article/angular-routing#dynamické-a-statické-title-pre-routy-v-angulare)
   - [Statický title](article/angular-routing#statický-title)
   - [Dynamický title](article/angular-routing#dynamický-title)
9. [Guards](article/angular-routing#guards)

## Zakladné informácie

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

## Zavedenie routingu do html markup (router-outlet)

- Angular **automaticky neurčuje**, kde sa má routovaný komponent vykresliť
- Je potrebné mu **explicitne povedať miesto vykreslenia**
- Na vykreslenie routovaného obsahu sa používa direktíva **`router-outlet`**
- Je to **zástupný prvok (placeholder)** pre komponenty načítané routovaním, nahrádza statický obsah
- `RouterOutlet` **nie je dostupný automaticky**
- Treba ho:
  - importovať v **TypeScript súbore komponentu**
  - pridať do poľa **`imports`** v dekorátore komponentu
- Komponent načítaný routou sa:
  - vykreslí **pri `router-outlet`**
  - konkrétne **pod ním**
- Na **poradí rout záleží:**
  - Pri rôznych cestách poradie nehrá rolu
  - Pri podobných cestách sa routy vyhodnocujú zhora nadol
  - Preto je vhodné mať jednoduché routy hore a zložitejšie (vnorené) nižšie.

---

## Navigácia medzi routami, odkazy a RouterLink

Používanie klasického `<a href="/tasks">` v Angular aplikácii spôsobuje zbytočný reload celej stránky a zhoršuje výkon aj UX.

Angular je single-page aplikácia, a správnym riešením je použiť direktívu **RouterLink**, ktorá zabezpečí navigáciu bez opätovného načítania stránky.

### RouterLink

Použitím RouterLink (ktorý musí byť pridaný do imports komponentu) sa URL zmení na /tasks bez reloadu stránky, **nevznikajú nové HTML/JS requesty** a Angular iba vymení komponent v router-outlet.

### RouterLinkActive

V Angulari môžeme používateľovi poskytnúť spätnú väzbu a zvýrazniť aktívny odkaz pomocou CSS triedy a direktívy **routerLinkActive**, napríklad:

```ts
 <a [routerLink]="'/tasks'" routerLinkActive="selected">User</a>
```

### Dynamické cesty

V Angulari môžeme načítať ten istý komponent s rôznymi dátami pre rôzne situácie tým, že **zakódujeme dynamický segment do URL (napr. /users/:userId/tasks)**. Dynamické routy umožňujú použiť jednu konfiguráciu komponentu pre rôzne dáta pomocou dynamického segmentu cesty :userId, ktorý môže byť pomenovaný podľa potreby a umožňuje mať aj viac dynamických segmentov v jednej route.

```ts
 <a [routerLink]="['/users', user.id]">User</a>
```

Hodnotu dynamického segmentu cesty (napr. userId) z URL môžeme získať a použiť ju v načítanom komponente (napr. UserTasksComponent) tým, že **pridáme input do komponentu s rovnakým názvom ako dynamický segment**, typicky ako string.

V Angulari sa v application config používa provideRouter s **withComponentInputBinding()** z @angular/router, čo povolí input-based prístup pre dynamické routy a Angular potom nastaví hodnotu userId inputu, ktorú môžeme použiť na získanie dát pre konkrétneho používateľa.

```ts
import { provideRouter, withComponentInputBinding } from '@angular/router';

const appConfig = {
  providers: [provideRouter(routes, withComponentInputBinding())],
};

bootstrapApplication(AppComponent, appConfig);
```

Nie je potrebné extrahovať dynamické parametre z route cez Signály, pretože je možné použiť aj klasické @Input() inputy.

```ts
@Input({ required: true }) userId!: string;
```

### Vnorené cesty

Cieľom vnorených (child) rout v Angulari je zobraziť vnorené komponenty tým, že tieto komponenty sa načítavajú do iného komponentu, ktorý bol načítaný cez rodičovskú routu, napríklad na zobrazenie úloh a formulára pre pridanie úlohy pre toho istého používateľa.

##### Konfigurácia child routes

Pridať **`children`** property do rodičovskej routy, hodnota je pole rout:

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

Cesty child rout automaticky sa pripoja k rodičovskej ceste

- /users/:userId/tasks
- /users/:userId/tasks/new

Každý rodičovský komponent pre child routes musí mať samostatný **router-outlet**, do ktorého sa načítavajú child komponenty, napríklad navigácia na /users/U2/tasks zobrazí TasksComponent, na /users/U2/tasks/new zobrazí NewTaskComponent.

V Angulari môžete pri navigácii medzi vnorenými routami použiť relatívne alebo absolútne cesty, pričom relatívne cesty sa pripoja k aktuálne aktívnej route (napr. /users/:id/tasks/new z komponentu UserTasksComponent) a absolútne cesty začínajú od koreňa URL, pričom pre správnu funkčnosť musíte importovať RouterLink a pridať ho do imports komponentu.

Pre child route **input binding na rodičovské parametre nefunguje automaticky**. Je potrebné použiť **ActivatedRoute.paramMap** alebo vo **withRouterConfig** v konfigurácii routera nastaviť `paramsInheritanceStrategy: 'always'` v `withRouteConfig` pre dedenie parametrov rodiča

### Programová navigácia

Pre navigáciu v kóde sa využíva Router service injektovaný do komponentu `import { Router } from '@angular/router'`a volanie metódy `router.navigate(commands: any[], options?: NavigationExtras)` umožňuje navigovať z kódu, pričom commands je pole segmentov cesty, napríklad `['/users', userId, 'tasks']`, a options môže obsahovať `replaceUrl: true`.

V Angulari Router objekt ponúka viacero metód na programatickú prácu s routami, okrem navigate(). Tu je prehľad najdôležitejších:

- navigateByUrl(url: string | UrlTree, extras?: NavigationBehaviorOptions)
  - Naviguje priamo na celú URL ako string alebo UrlTree. Rozdiel oproti navigate() je, že tu zadávaš už hotovú URL, nie pole segmentov.
- createUrlTree(commands: any[], extras?: UrlCreationOptions): UrlTree
  - Vytvorí objekt UrlTree, ktorý reprezentuje URL. Môže byť použitý napr. na predgenerovanie URL bez okamžitej navigácie.
- serializeUrl(url: UrlTree): string
  - Konvertuje UrlTree na string, ktorý môžeš zobraziť alebo použiť.
- isActive(url: string | UrlTree, exact: boolean): boolean
  - Skontroluje, či je daná URL aktívna vzhľadom na aktuálnu route. Užitočné pre zistenie aktívnej linky.

V Angulari metóda router.navigate() akceptuje druhý argument – objekt s rôznymi možnosťami (NavigationExtras), ktoré ovplyvňujú správanie navigácie. Tu sú najdôležitejšie možnosti:

```ts
this.router.navigate(['/path'], {
  relativeTo: this.route, // Relatívna navigácia vzhľadom na aktuálnu ActivatedRoute
  queryParams: { page: 2 }, // Pridanie query parametrov do URL
  fragment: 'top', // Nastavenie fragmentu (#top) v URL
  queryParamsHandling: 'merge' | 'preserve', // Merge alebo zachovanie existujúcich query parametrov
  preserveFragment: true, // Zachovať existujúci fragment v URL
  skipLocationChange: true, // Navigácia sa vykoná, ale URL sa nezmení v prehliadači
  replaceUrl: true, // Nahradí aktuálnu URL v histórii (bráni návratu späť)
  state: { example: 123 }, // Odoslanie stavu (history.state) medzi stránkami
});
```

- relativeTo – umožňuje definovať, že navigácia je relatívna k určitej route.
- queryParams – pridať parametre po ? do URL.
- fragment – nastaviť hash fragment (napr. #top).
- queryParamsHandling – 'merge' zlúči nové query parametre s existujúcimi, 'preserve' zachová všetky existujúce.
- preserveFragment – zachová aktuálny fragment pri navigácii.
- skipLocationChange – stránka sa naviguje, ale URL sa nemení.
- replaceUrl – nahradí aktuálnu URL a zabráni návratu späť.
- state – umožňuje posielať dáta medzi stránkami cez history.state.

### Not Found (Catch-All) Route

Slúži na ošetrite situácie, keď používateľ zadá neexistujúcu cestu, a zabezpečí zobrazenie fallback komponentu namiesto návratu na štartovaciu stránku. Definovaním catch-all route ako poslednou route `({ path: '**', component: NotFoundComponent })`, ktorá zachytí všetky URL nezodpovedajúce existujúcim routám a zobrazí fallback komponent, napr. `NotFoundComponent`.

### Presmerovanie (Redirect)

Používateľ môže byť automaticky presmerovaný, ak nezadá konkrétnu cestu alebo je cesta prázdna, namiesto zobrazovania fallback komponentu. Presmerovanie sa definuje pomocou path ('') a vlastnosti redirectTo, pričom je potrebné nastaviť pathMatch na full (v prípade ak existujú rovnaké podobné cesty, aby presmerovanie nastalo len pri presnej URL), pretože prefix by mohlo spôsobiť nekonečný redirect loop. Takto pri zadaní prázdnej cesty používateľ automaticky prejde na zvolenú route.

- `pathMatch: 'full'` zabezpečí, že presmerovanie nastane len ak je URL presne prázdna.
- `pathMatch: 'prefix'` by presmerovalo aj pre URL, ktoré začínajú prázdnym stringom, čo môže spôsobiť nekonečný redirect loop.

```ts
  { path: '', redirectTo: 'tasks', pathMatch: 'full' }
```

---

## ActivatedRoute a snapshot

**ActivatedRoute** je Angular služba, ktorú môžeme injektovať do komponentu, aby sme získali informácie o aktuálne aktívnej route, napr. dynamické parametre, query parametre alebo prednačítané dáta.

ActivatedRoute poskytuje **paramMap, params, queryParams, data a ďalšie properties** pre prístup k informáciám o route.

Okrem toho je k dispozícii **snapshot**, ktorý poskytuje aktuálne hodnoty parametrov ako obyčajné **stringy a nie observables**.

Snapshot je vhodný pre komponenty, ktoré **nevyžadujú reaktívne aktualizácie** pri zmene route, pretože hodnoty sa pri prepnutí route automaticky neaktualizujú.

Ak komponent môže byť znovu používaný pri zmene route, je lepšie použiť subscription na paramMap alebo params alebo Angular input binding, aby sme získali dynamicky aktualizované hodnoty.

Snapshot je jednoduchý a rýchly spôsob, ako získať dáta, ale nezachytáva zmeny po inicializácii komponentu.

```ts
constructor(private route: ActivatedRoute) {}

ngOnInit() {
  const userId = this.route.snapshot.paramMap.get('userId');
  console.log(userId); // aktuálna hodnota parametra userId
}
```

Použitie snapshotu je často viditeľné v projektoch, kde komponent nevyžaduje dynamické prepínanie dát pri zmene URL.

---

## Query parametre

Query parametre sú dodatočné dáta v URL za otáznikom (?), napr.: `/tasks?order=asc`. Umožňujú **dynamicky meniť obsah** komponentu a **vytvárať shareable odkazy**. Nastavujú sa pomocou `[queryParams]` na elementoch s `[routerLink]`:

```ts
<a [routerLink]="['.']" [queryParams]="{ order: 'asc' }">Sort Ascending</a>
```

`[routerLink]="['.']"` zabezpečí, že link zostane na aktuálnej stránke. Hodnoty query parametrov sa môžu čítať priamo ako input (ak je povolené componentInputBinding) alebo cez ActivatedRoute.queryParams:

```ts
// Input binding
@Input() order?: string;

// Alebo cez ActivatedRoute
this.route.queryParams.subscribe(params => {
  this.order = params['order'];
});
```

Umožňujú dynamicky prepínať stav, napr. asc ↔ desc, bez reloadu stránky. Použitie query parametrov zjednodušuje zdieľanie URL so stavom komponentu.

---

## Statické data

Angular Router umožňuje priradiť k route **statické dáta** pomocou vlastnosti data v route konfigurácii.

data je ľubovoľný objekt s key–value pármi, napr. data: { message: 'Hello!' }. Tieto dáta sú dostupné komponentu, ktorý je načítaný danou routou.

Ak je zapnuté withComponentInputBinding, hodnoty z data sa automaticky mapujú na @Input() vlastnosti komponentu. Komponent tak môže prijímať route data bez nutnosti používať ActivatedRoute.

Route data je vhodné najmä pre statické informácie, ako konfiguráciu, texty alebo flagy správania. Použitie data pomáha udržať komponenty čistejšie a jednoduchšie, keďže presúva časť logiky do routingu.

---

## Resolvers (resolve)

Route resolve sa používa na načítanie dynamických dát pred aktiváciou routy. Je vhodný pre dáta, ktoré závisia od route parametrov (napr. userId).

Resolver funguje podobne ako data, ale namiesto statických hodnôt vracia dynamicky vypočítané alebo načítané dáta.

V route konfigurácii sa resolve definuje ako objekt s key–value pármi, kde: `key` = názov dát dostupných v komponente, `value` = resolver funkcia.

### Resolver funkcia

V modernom Angulari **je resolver funkcia**, nie trieda. Resolver má typ ResolveFn<T> importovaný z @angular/router. Funkcia musí akceptovať: `ActivatedRouteSnapshot` – poskytuje prístup k route parametrom, `RouterStateSnapshot` – informácie o aktuálnom stave routera. Resolver sa spustí pri každej aktivácii routy, aj keď sa zmenia len parametre. Nie je potrebné používať subscriptions, pretože resolver sa automaticky znovu vykoná.

Ak je zapnuté withComponentInputBinding, resolved dáta sú automaticky dostupné ako @Input() vlastnosti komponentu. Názov inputu sa zhoduje s key v resolve objekte. Komponent nemusí používať ActivatedRoute ani ngOnInit.

### Resolvers a zmeny query parametrov

Resolvers je možné použiť nielen na načítanie jedného dátového objektu (napr. username), ale aj na načítanie komplexných dát, ako sú zoznamy (napr. úlohy používateľa). Komponenty môžu byť zjednodušené tak, že plne spoliehajú na inputs, pričom všetka logika načítania dát je presunutá do resolverov.

Resolver môže pracovať aj s query parametrami (napr. order=asc | desc).

#### Predvolené správanie resolverov

Angular automaticky znovu spustí resolver, keď sa zmenia route parametre (napr. :userId). Resolver sa **NEspustí znova**, keď sa zmenia query parametre (?order=asc). To môže viesť k situácii, kde: URL sa zmení, ale dáta v komponente zostanú rovnaké.

Angular umožňuje zmeniť správanie resolverov pomocou vlastnosti **runGuardsAndResolvers** v route konfigurácii. Táto vlastnosť určuje, kedy sa majú znovu spustiť guards a resolvers. Najčastejšie hodnoty `always` -
Resolvers sa spustia pri akejkoľvek zmene na route. `paramsOrQueryParamsChange` - Resolvers sa spustia pri zmene: route parametrov, alebo query parametrov (odporúčané pre triedenie, filtrovanie).

Praktický dopad

Po nastavení runGuardsAndResolvers: 'paramsOrQueryParamsChange' resolver reaguje na zmenu userId, resolver reaguje na zmenu order v query parametroch, dáta sa znovu načítajú a správne zoradia.

Zabezpečuje sa tak, že URL je jediným zdrojom pravdy pre stav aplikácie.

## Dynamické a statické title pre routy v Angulari

Angular umožňuje nastavovať title stránky (page title) priamo v konfigurácii rout. Title sa automaticky aktualizuje pri navigácii medzi routami a používa sa v prehliadači (tab), vo výsledkoch vyhľadávačov (SEO).

### Statický title

Pre každú route je možné nastaviť statický title pomocou vlastnosti title. Hodnota je jednoduchý string. Vhodné pre routy, kde sa názov stránky nemení.

### Dynamický title

title nemusí byť len string, ale aj resolver funkcia. Resolver pre title funguje rovnako ako dátový resolver. Má typ `ResolveFn<string>`, vracia string, dostáva `ActivatedRouteSnapshot a RouterStateSnapshot`. Dynamický title môže závisieť od route parametrov, dát načítaných resolverom (napr. username).

---

## Guards

Route guards slúžia na kontrolu, či je navigácia na určitú route povolená alebo nie. V modernom Angulari sa guardy najčastejšie definujú ako funkcie (starší prístup používal triedy).

Typy route guardov:

- canMatch
  - Najmodernejší a najflexibilnejší guard. Rozhoduje, či sa route vôbec zhoduje s aktuálnou URL. Ovláda prístup k route aj jej child routam.

- canActivate
  - Spúšťa sa po tom, čo Angular nájde zodpovedajúcu route, ale ešte pred načítaním komponentu.

- canActivateChild
  - Používa sa na ochranu child rout.

- canDeactivate
  - Kontroluje, či je možné opustiť aktuálnu route (napr. pri neuložených zmenách).

Definovanie canMatch guardu (funkčný prístup)

Guard je funkcia typu CanMatchFn. Funkcia prijíma: informácie o route, pole URL segmentov. V guard funkcii je možné: injectnúť služby, vykonávať synchronickú alebo asynchrónnu logiku.

Návratové hodnoty guardu:

- true – prístup povolený.
- false – prístup zamietnutý (neodporúčané, môže viesť k „rozbitej“ stránke).
- RedirectCommand – presmerovanie na inú route (odporúčaný spôsob).

Všetky hodnoty môžu byť vrátené aj ako Observable.

---

## Pojmy

#### - SPA (Single Page Application)

SPA je webová aplikácia, ktorá načíta jeden HTML dokument a následne dynamicky mení obsah stránky pomocou JavaScriptu bez potreby jej opätovného načítania.

#### - Konfiguračný objekt bootstrapApplication

Konfiguračný objekt pre `bootstrapApplication` je objekt typu `ApplicationConfig`, ktorý umožňuje nastaviť poskytovateľov (providers), smerovanie (routing), importy modulov a ďalšie konfigurácie pri spúšťaní Angular aplikácie.

```ts
const appConfig = {
  providers: [provideRouter([{ path: 'tasks', component: TasksComponent }])],
};

bootstrapApplication(AppComponent, appConfig);
```

#### App komponent

- **App komponent** je hlavný komponent aplikácie
- Vykresľuje sa **ako prvý** pri štarte aplikácie
- Slúži ako miesto, kde definujeme rozloženie (layout)
