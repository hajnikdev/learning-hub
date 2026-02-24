## Zaklad
- **HttpClient** je Angular sluzba na HTTP komunikaciu.
- Requesty vracaju **Observable** a spustia sa az po `subscribe()`.
- Typovanie odpovede zlepsuje DX a validuje tvar dat.

---

## Setup
- Poskytnutie HttpClient (standalone):
  ```ts
  import { provideHttpClient } from '@angular/common/http';

  bootstrapApplication(AppComponent, {
    providers: [provideHttpClient()]
  });
  ```

---

## GET + typovanie
```ts
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';

type PlacesResponse = { places: Place[] };

http
  .get<PlacesResponse>('http://localhost:3000/places')
  .pipe(map((res) => res.places))
  .subscribe((places) => {
    // pouzi places
  });
```

---

## Observe response a events
```ts
import { HttpEvent, HttpEventType, HttpResponse } from '@angular/common/http';

http
  .get<PlacesResponse>('http://localhost:3000/places', { observe: 'response' })
  .subscribe((res: HttpResponse<PlacesResponse>) => {
    console.log(res.status, res.body?.places ?? []);
  });

http
  .get<PlacesResponse>('http://localhost:3000/places', { observe: 'events' })
  .subscribe((event: HttpEvent<PlacesResponse>) => {
    if (event.type === HttpEventType.Response) {
      console.log(event.status, event.body?.places ?? []);
    }
  });
```

---

## Loading + error stav
```ts
import { catchError, throwError } from 'rxjs';

isFetching.set(true);

http
  .get<PlacesResponse>('http://localhost:3000/places')
  .pipe(
    map((res) => res.places),
    catchError((err) => {
      console.error(err);
      return throwError(() => new Error('Nepodarilo sa nacitat miesta.'));
    })
  )
  .subscribe({
    next: (places) => this.places.set(places),
    error: (err: Error) => this.error.set(err.message),
    complete: () => isFetching.set(false)
  });
```

---

## PUT (odoslanie dat)
```ts
http
  .put('http://localhost:3000/user-places', { placeId: place.id })
  .subscribe();
```

---

## DELETE (mazanie)
```ts
http
  .delete(`http://localhost:3000/user-places/${place.id}`)
  .subscribe();
```

---

## Service pre HTTP logiku
```ts
@Injectable({ providedIn: 'root' })
export class PlacesService {
  private http = inject(HttpClient);

  private fetchPlaces(url: string, errorMessage: string) {
    return this.http.get<PlacesResponse>(url).pipe(
      map((res) => res.places),
      catchError((err) => {
        console.error(err);
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  loadAvailablePlaces() {
    return this.fetchPlaces('http://localhost:3000/places', 'Nepodarilo sa nacitat dostupne miesta.');
  }
}
```

---

## Optimistic update + rollback
```ts
addPlaceToUserPlaces(place: Place) {
  const prev = this.userPlaces();
  this.userPlaces.set([...prev, place]);

  return this.http
    .put('http://localhost:3000/user-places', { placeId: place.id })
    .pipe(
      catchError(() => {
        this.userPlaces.set(prev);
        return throwError(() => new Error('Nepodarilo sa ulozit miesto.'));
      })
    );
}
```

---

## Interceptors
```ts
import { HttpHandlerFn, HttpRequest, HttpEventType } from '@angular/common/http';
import { tap } from 'rxjs';

export function loggingInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn) {
  const cloned = req.clone({ headers: req.headers.set('X-DEBUG', 'TESTING') });

  return next(cloned).pipe(
    tap((event) => {
      if (event.type === HttpEventType.Response) {
        console.log('Response', event.status);
      }
    })
  );
}
```

```ts
import { provideHttpClient, withInterceptors } from '@angular/common/http';

bootstrapApplication(AppComponent, {
  providers: [provideHttpClient(withInterceptors([loggingInterceptor]))]
});
```

---

## Quick reference
- **Setup:** `provideHttpClient()`
- **GET:** `http.get<T>(url)`
- **POST/PUT/DELETE:** `http.post|put|delete(url, body?)`
- **Observe:** `{ observe: 'response' | 'events' }`
- **Loading/Error:** `isFetching`, `catchError`, `throwError`
- **Service:** spolocna HTTP logika
- **Optimistic:** lokalna zmena + rollback v `catchError`
- **Interceptors:** `withInterceptors([fn])`
