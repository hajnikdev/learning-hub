## Aktivácia Service Workera

- Pridať do `app.config.ts` alebo `main.ts`:
  ```ts
  import { provideServiceWorker } from '@angular/service-worker';
  bootstrapApplication(AppComponent, {
    providers: [provideServiceWorker('ngsw-worker.js', { enabled: environment.production })],
  });
  ```

---

## Súbor `ngsw-config.json`

- Definuje, čo a ako sa cacheuje.
- Hlavné sekcie:
  - `assetGroups`: Statické súbory (HTML, CSS, JS, obrázky, fonty, atď.)
  - `dataGroups`: API a dynamické dáta

---

### assetGroups – príklad

```json
"assetGroups": [
  {
    "name": "app",
    "installMode": "prefetch",
    "resources": {
      "files": ["/index.html", "/*.css", "/*.js"],
      "urls": ["https://fonts.googleapis.com/css2", "https://fonts.gstatic.com/s/roboto/*"]
    }
  },
  {
    "name": "assets",
    "installMode": "lazy",
    "updateMode": "prefetch",
    "resources": {
      "files": ["/assets/**"]
    }
  }
]
```

- `installMode: prefetch` – všetko sa stiahne hneď
- `installMode: lazy` – stiahne sa až pri prvom použití

---

### dataGroups – príklad

```json
"dataGroups": [
  {
    "name": "api",
    "urls": ["/api/**"],
    "cacheConfig": {
      "strategy": "freshness",
      "maxSize": 20,
      "maxAge": "1h",
      "timeout": "10s"
    }
  }
]
```

- `strategy: freshness` – preferuje sieť, fallback na cache
- `strategy: performance` – preferuje cache, fallback na sieť

---

## Najčastejšie chyby

- Chýbajúce súbory v assets alebo icons → 404/504 chyby
- Nesprávne cesty v `ngsw-config.json`
- Zmeny v konfigurácii vyžadujú nový build a reload

---

## Užitočné príkazy

- Build s PWA:  
  `ng build --configuration production`
- Lokálny server:  
  `npx http-server dist/<nazov-projektu>/browser`

---

## Debugging

- Chrome DevTools → Application → Service Workers
- Odstrániť cache:  
  Application → Clear storage → Clear site data
- Reload s Ctrl+Shift+R (hard reload)

---

## Odkazy

- [Oficiálna dokumentácia Angular PWA](https://angular.io/guide/service-worker-intro)
- [Konfigurácia ngsw-config.json](https://angular.io/guide/service-worker-config)

---
