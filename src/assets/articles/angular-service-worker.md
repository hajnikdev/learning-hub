## Obsah

## Zakladné informácie

Service Worker je špeciálny typ Web Workera, ktorý beží na samostatnom vlákne a je oddelený od hlavného JavaScript kódu aplikácie. Angular aplikácia, rovnako ako bežná webová aplikácia, používa JavaScript, ktorý je jednovláknový, no vďaka asynchrónnym mechanizmom dokáže spracovávať viacero úloh bez blokovania vykonávania kódu. Service Worker však beží na inom vlákne než hlavná aplikácia, vďaka čomu je od nej do veľkej miery nezávislý.

Táto nezávislosť umožňuje, aby Service Worker bežal aj na pozadí, napríklad v mobilných prehliadačoch, a vykonával úlohy aj vtedy, keď používateľ aktívne nepracuje s aplikáciou. Vďaka tomu dokáže prijímať push notifikácie a spravovať buď viacero stránok webovej aplikácie, alebo jednu single-page aplikáciu, akou je napríklad Angular aplikácia.

Service Worker funguje ako proxy medzi frontendovou časťou aplikácie a backendom. To znamená, že zachytáva všetky odchádzajúce HTTP požiadavky, ktoré aplikácia odosiela, napríklad pri načítaní HTML stránky, CSS štýlov, JavaScript súborov, fontov alebo dát z API. S týmito požiadavkami môže ďalej pracovať, napríklad ich cacheovať, upravovať alebo rozhodnúť, či sa majú odoslať na server.

Vďaka cacheovaniu odpovedí dokáže Service Worker zabezpečiť, že aplikácia funguje aj v offline režime alebo pri slabom internetovom pripojení, pokiaľ je požadovaný obsah už uložený v cache. Tým výrazne zlepšuje používateľský zážitok a robí z webovej aplikácie plnohodnotnú progresívnu webovú aplikáciu (PWA).

---

## Výhody Service Workera

- Cachevanie statických a dynamických zdrojov (HTML, CSS, JS, API dáta)
- Offline režim pre aplikáciu
- Podpora push notifikácií
- Správa viacerých stránok z jedného worker-u
- Proxy pre HTTP požiadavky

---

## Registrácia Service Workera

V standalone Angular aplikácii sa Service Worker registruje v súbore `main.ts` alebo `app.config.ts` pomocou funkcie `provideServiceWorker`. Táto funkcia pochádza z balíka `@angular/service-worker` a nahrádza starý `ServiceWorkerModule.register`.

Registrácia Service Workera prebieha iba v produkčnom prostredí, aby počas vývoja nespôsoboval problémy s cacheovaním. Angular automaticky rozpozná, či ide o produkčný build, a podľa toho Service Worker aktivuje alebo deaktivuje.

## Generovanie ngsw-worker.js

Súbor `ngsw-worker.js` sa stále negeneruje ručne, ale automaticky počas produkčného buildu pomocou príkazu `ng build --configuration production`. Tento súbor sa uloží do priečinka `dist/<nazov-projektu>` a obsahuje kompletnú logiku cacheovania a správy offline režimu.

Angular používa hashovanie súborov, aby Service Worker dokázal rozpoznať nové verzie aplikácie a aktualizovať cache bez toho, aby používateľ videl zastaraný obsah.

## Spustenie aplikácie a offline režim

Aby Service Worker fungoval správne, aplikácia musí byť spustená cez HTTP server a nie priamo zo súborového systému. Na lokálne testovanie sa používa jednoduchý server `http-server`, ktorý poskytne obsah priečinka `dist`.

Po prvom načítaní aplikácie Service Worker zachytí a uloží statické súbory do cache. Pri ďalšom načítaní aplikácie, aj bez internetového pripojenia, sa tieto súbory načítajú priamo z cache a aplikácia zostane funkčná.

## Cacheovanie statických a dynamických dát

V predvolenom nastavení Angular Service Worker cacheouje statické súbory, ako sú HTML, CSS a JavaScript. Dynamické dáta z API sa však offline neukladajú automaticky.

Ak má aplikácia fungovať offline aj s dátami zo servera, je potrebné upraviť súbor `ngsw-config.json` a definovať pravidlá pre Cacheovanie API požiadaviek. Tým sa dosiahne, že aplikácia bude v offline režime zobrazovať rovnaký obsah ako v online režime.

---

## Vysvetlenie súboru ngsw-config.json

Súbor `ngsw-config.json` je konfiguračný súbor pre Angular Service Worker, ktorý definuje, aké zdroje a akým spôsobom sa budú cacheovať a spravovať v offline režime. Tento súbor je kľúčový pre správne fungovanie PWA funkcionality v Angular aplikácii.

### Štruktúra súboru

- `$schema`: Odkazuje na schému, ktorá slúži na validáciu konfigurácie.
- `index`: Hlavný HTML súbor aplikácie, ktorý sa načíta pri spustení.
- `assetGroups`: Pole skupín zdrojov, ktoré určujú, ako sa budú jednotlivé typy súborov cacheovať.

#### Príkladová konfigurácia:

```json
{
  "$schema": "./node_modules/@angular/service-worker/config/schema.json",
  "index": "/index.html",
  "assetGroups": [
    {
      "name": "app",
      "installMode": "prefetch",
      "resources": {
        "files": [
          "/favicon.ico",
          "/index.csr.html",
          "/index.html",
          "/manifest.webmanifest",
          "/*.css",
          "/*.js"
        ],
        "urls": [
          "https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100..900;1,100..900&display=swap"
        ]
      }
    },
    {
      "name": "assets",
      "installMode": "lazy",
      "updateMode": "prefetch",
      "resources": {
        "files": ["/**/*.(svg|cur|jpg|jpeg|png|apng|webp|avif|gif|otf|ttf|woff|woff2|json|md)"]
      }
    }
  ]
}
```

### Vysvetlenie jednotlivých častí

- **assetGroups**: Rozdeľuje zdroje do skupín podľa spôsobu cacheovania.
  - `app`: Základné súbory aplikácie (HTML, CSS, JS, manifest, favicon).
    - `installMode: prefetch` znamená, že všetky tieto súbory sa stiahnu a cacheujú hneď pri prvej inštalácii Service Workera.
    - `resources.files`: Zoznam súborov, ktoré sa majú cacheovať.
    - `resources.urls`: Externé URL (napr. Google Fonts), ktoré sa majú cacheovať.
  - `assets`: Ostatné statické súbory (obrázky, fonty, JSON, markdown atď.).
    - `installMode: lazy` znamená, že tieto súbory sa cacheujú až pri prvom prístupe používateľa.
    - `updateMode: prefetch` zabezpečí, že po aktualizácii aplikácie sa nové verzie týchto súborov stiahnu na pozadí.
    - `resources.files`: Všetky súbory v assets, ktoré zodpovedajú zadanému vzoru.

### Prispôsobenie pre API

Ak chcete cacheovať aj odpovede z API, je potrebné pridať sekciu `dataGroups`, kde môžete definovať pravidlá pre HTTP požiadavky na API (napr. endpointy, stratégie cacheovania, expiráciu atď.).

### Prispôsobenie pre API

Ak chcete cacheovať aj odpovede z API, je potrebné pridať sekciu `dataGroups` do súboru `ngsw-config.json`. Táto sekcia umožňuje definovať pravidlá pre HTTP požiadavky na API, ako sú endpointy, stratégie cacheovania, expirácia a pod.

#### Príklad konfigurácie dataGroups

```json
"dataGroups": [
  {
    "name": "api-data",
    "urls": [
      "https://api.example.com/data",
      "https://api.example.com/data/*"
    ],
    "cacheConfig": {
      "strategy": "freshness",
      "maxSize": 100,
      "maxAge": "1h",
      "timeout": "10s"
    }
  },
  {
    "name": "local-json",
    "urls": [
      "/assets/topics.json"
    ],
    "cacheConfig": {
      "strategy": "performance",
      "maxSize": 5,
      "maxAge": "24h"
    }
  }
]
```

#### Vysvetlenie hodnôt

- `name`: Názov skupiny pre cacheovanie dát.
- `urls`: Pole URL alebo vzorov, ktoré určujú, ktoré požiadavky budú cacheované.
- `cacheConfig`: Nastavenia cacheovania:
  - `strategy`:
    - `"performance"` – najprv sa použije cache, ak je dostupná, inak sieť.
    - `"freshness"` – najprv sa použije sieť, ak je dostupná, inak cache.
  - `maxSize`: Maximálny počet položiek v cache.
  - `maxAge`: Maximálny čas, počas ktorého budú položky v cache (napr. `"1h"`, `"24h"`).
  - `timeout`: (len pre `"freshness"`) Časový limit na odpoveď zo siete, po ktorom sa použije cache.

Použitie `dataGroups` je vhodné pre API endpointy, dynamické JSON súbory alebo iné dáta, ktoré chcete sprístupniť offline alebo urýchliť ich načítanie.
