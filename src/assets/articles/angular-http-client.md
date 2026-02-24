
## Obsah

1. [Zakladne informacie](article/angular-http-client#zakladne-informacie)
2. [Priprava HttpClient](article/angular-http-client#priprava-httpclient)
3. [GET request a typovanie odpovede](article/angular-http-client#get-request-a-typovanie-odpovede)
4. [Observe response a events](article/angular-http-client#observe-response-a-events)
5. [Loading a error stavy](article/angular-http-client#loading-a-error-stavy)
6. [Odoslanie dat na backend (PUT)](article/angular-http-client#odoslanie-dat-na-backend-put)
7. [Nacitanie oblubenych miest](article/angular-http-client#nacitanie-oblubenych-miest)
8. [Spolocna HTTP logika v service](article/angular-http-client#spolocna-http-logika-v-service)
9. [Synchronizacia stavu a optimistic update](article/angular-http-client#synchronizacia-stavu-a-optimistic-update)
10. [Globalne chyby cez error modal](article/angular-http-client#globalne-chyby-cez-error-modal)
11. [Mazanie (DELETE) s rollbackom](article/angular-http-client#mazanie-delete-s-rollbackom)
12. [Interceptors](article/angular-http-client#interceptors)

## Zakladne informacie

Angular aplikacia nekomunikuje priamo s databazou. Bezi v prehliadaci, preto sa data posielaju cez backend API (HTTP requesty). HTTP klient v Angulari riesi:

- odosielanie GET/POST/PUT/DELETE requestov
- spracovanie odpovedi a chyb
- typovanie odpovede a transformacie cez RxJS

---

## Priprava HttpClient

HttpClient je sluzba a musi byt poskytovana aplikacii.

```ts
import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';

bootstrapApplication(AppComponent, {
	providers: [provideHttpClient()]
});
```

---

## GET request a typovanie odpovede

HttpClient vracia Observable. Request sa spusti az po `subscribe()`.

```ts
import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import { Place } from './place.model';

type PlacesResponse = { places: Place[] };

@Component({ /* ... */ })
export class AvailablePlacesComponent implements OnInit {
	private http = inject(HttpClient);
	private destroyRef = inject(DestroyRef);

	places = signal<Place[]>([]);

	ngOnInit(): void {
		const sub = this.http
			.get<PlacesResponse>('http://localhost:3000/places')
			.pipe(map((res) => res.places))
			.subscribe({
				next: (places) => this.places.set(places)
			});

		this.destroyRef.onDestroy(() => sub.unsubscribe());
	}
}
```

---

## Observe response a events

Namiesto samotneho tela odpovede mozes pozorovat celu odpoved alebo eventy.

```ts
import { HttpEvent, HttpEventType, HttpResponse } from '@angular/common/http';

this.http
	.get<PlacesResponse>('http://localhost:3000/places', {
		observe: 'response'
	})
	.subscribe((res: HttpResponse<PlacesResponse>) => {
		console.log(res.status, res.body?.places ?? []);
	});

this.http
	.get<PlacesResponse>('http://localhost:3000/places', {
		observe: 'events'
	})
	.subscribe((event: HttpEvent<PlacesResponse>) => {
		if (event.type === HttpEventType.Response) {
			console.log(event.status, event.body?.places ?? []);
		}
	});
```

---

## Loading a error stavy

Na UI sa oplati zobrazit loading a error stav.

```ts
import { catchError, throwError } from 'rxjs';

isFetching = signal(false);
error = signal('');

ngOnInit(): void {
	this.isFetching.set(true);

	const sub = this.http
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
			complete: () => this.isFetching.set(false)
		});

	this.destroyRef.onDestroy(() => sub.unsubscribe());
}
```

```html
@if (isFetching() && !error()) {
	<p class="fallback-text">Nacitavam miesta...</p>
}

@if (error()) {
	<p class="fallback-text">{{ error() }}</p>
}
```

---

## Odoslanie dat na backend (PUT)

PUT request potrebuje telo requestu a spusti sa az po `subscribe()`.

```ts
onSelectPlace(place: Place): void {
	const sub = this.http
		.put('http://localhost:3000/user-places', {
			placeId: place.id
		})
		.subscribe();

	this.destroyRef.onDestroy(() => sub.unsubscribe());
}
```

---

## Nacitanie oblubenych miest

Rovnaky pristup ako pri GET, len iny endpoint a iny text chyb.

```ts
this.http
	.get<PlacesResponse>('http://localhost:3000/user-places')
	.pipe(map((res) => res.places))
	.subscribe({
		next: (places) => this.places.set(places)
	});
```

---

## Spolocna HTTP logika v service

Opakovany kod presun do service a komponenty nech riesia UI.

```ts
import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { catchError, map, throwError } from 'rxjs';
import { Place } from './place.model';

type PlacesResponse = { places: Place[] };

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
		return this.fetchPlaces(
			'http://localhost:3000/places',
			'Nepodarilo sa nacitat dostupne miesta.'
		);
	}

	loadUserPlaces() {
		return this.fetchPlaces(
			'http://localhost:3000/user-places',
			'Nepodarilo sa nacitat oblubene miesta.'
		);
	}
}
```

---

## Synchronizacia stavu a optimistic update

Udrzuj user places v service a aktualizuj ich optimisticky.

```ts
import { tap, catchError, throwError } from 'rxjs';

private userPlaces = signal<Place[]>([]);
loadedUserPlaces = this.userPlaces.asReadonly();

loadUserPlaces() {
	return this.fetchPlaces(
		'http://localhost:3000/user-places',
		'Nepodarilo sa nacitat oblubene miesta.'
	).pipe(tap((places) => this.userPlaces.set(places)));
}

addPlaceToUserPlaces(place: Place) {
	const prev = this.userPlaces();
	const exists = prev.some((p) => p.id === place.id);

	if (!exists) {
		this.userPlaces.set([...prev, place]);
	}

	return this.http
		.put('http://localhost:3000/user-places', { placeId: place.id })
		.pipe(
			catchError((err) => {
				this.userPlaces.set(prev);
				return throwError(() => new Error('Nepodarilo sa ulozit miesto.'));
			})
		);
}
```

---

## Globalne chyby cez error modal

Chyby z roznych komponentov mozes smerovat do centralneho modalu.

```ts
import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ErrorService {
	private message = signal('');
	error = this.message.asReadonly();

	showError(message: string): void {
		this.message.set(message);
	}

	clear(): void {
		this.message.set('');
	}
}
```

```html
@if (error()) {
	<app-error-modal title="Nastala chyba" [message]="error()" />
}
```

---

## Mazanie (DELETE) s rollbackom

DELETE bez request body, id ide do URL. Optimisticky odstranis a pri chybe vratis.

```ts
removeUserPlace(place: Place) {
	const prev = this.userPlaces();
	const next = prev.filter((p) => p.id !== place.id);

	this.userPlaces.set(next);

	return this.http
		.delete(`http://localhost:3000/user-places/${place.id}`)
		.pipe(
			catchError((err) => {
				this.userPlaces.set(prev);
				return throwError(() => new Error('Nepodarilo sa odstranit miesto.'));
			})
		);
}
```

---

## Interceptors

Interceptor spusti logiku pre kazdy request alebo response.

```ts
import {
	HttpHandlerFn,
	HttpRequest,
	HttpEventType
} from '@angular/common/http';
import { tap } from 'rxjs';

export function loggingInterceptor(
	req: HttpRequest<unknown>,
	next: HttpHandlerFn
) {
	const cloned = req.clone({
		headers: req.headers.set('X-DEBUG', 'TESTING')
	});

	return next(cloned).pipe(
		tap((event) => {
			if (event.type === HttpEventType.Response) {
				console.log('Response', event.status, event.body);
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