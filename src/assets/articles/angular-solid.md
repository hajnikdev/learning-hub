## Obsah

1. [Zakladne informacie](article/angular-solid#zakladne-informacie)
2. [Prehlad SOLID](article/angular-solid#prehlad-solid)
3. [S - Single Responsibility Principle](article/angular-solid#s---single-responsibility-principle)
4. [O - Open-Closed Principle](article/angular-solid#o---open-closed-principle)
5. [L - Liskov Substitution Principle](article/angular-solid#l---liskov-substitution-principle)
6. [I - Interface Segregation Principle](article/angular-solid#i---interface-segregation-principle)
7. [D - Dependency Inversion Principle](article/angular-solid#d---dependency-inversion-principle)

## Zakladne informacie

SOLID su odporucania, ako navrhovat kod tak, aby bol udrzatelny, flexibilny a dobre rozsiritelny. Nie su to hotove recepty, ale pravidla, ktore pomahaju rozpoznat, kedy je dizajn prilis tesny alebo tazko testovatelny. V Angular projekte sa SOLID pravidelne objavuje pri komponovanom UI, v servisoch a pri dependency injection.

---

## Prehlad SOLID

- **S**ingle Responsibility: jedna zodpovednost na triedu alebo komponent.
- **O**pen-Closed: otvorene pre rozsirenie, zatvorene pre modifikaciu.
- **L**iskov Substitution: potomok musi byt zamenitelny za predka bez rozbitia kontraktu.
- **I**nterface Segregation: viac malych rozhrani namiesto jedneho velkeho.
- **D**ependency Inversion: zavisiet od abstrakcii, nie od konkretnych implementacii.

---

## S - Single Responsibility Principle

Komponent alebo trieda by mali mat len jeden dovod na zmenu. Ak pri popise zodpovednosti pouzivas slovicko "a", je to signal, ze komponent robi prilis vela.

### Zle: komponent robi UI aj export dat

```ts
@Component({
	selector: 'app-root',
	template: `
		<app-toolbar></app-toolbar>
		<main>
			<section class="widget">
				<h2>Weather</h2>
				<button (click)="exportJson()">Export</button>
			</section>
		</main>
	`,
})
export class AppComponent {
	exportJson() {
		const data = { temp: 21, unit: 'C' };
		const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
		const link = document.createElement('a');
		link.href = URL.createObjectURL(blob);
		link.download = 'weather.json';
		link.click();
	}
}
```

### Lepsie: UI oddelene od exportu

```ts
@Injectable({ providedIn: 'root' })
export class JsonExporterService {
	export(data: unknown, filename: string) {
		const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
		const link = document.createElement('a');
		link.href = URL.createObjectURL(blob);
		link.download = filename;
		link.click();
	}
}

@Component({
	selector: 'app-widget',
	template: `
		<section class="widget">
			<h2>Weather</h2>
			<button (click)="onExport()">Export</button>
		</section>
	`,
})
export class WidgetComponent {
	constructor(private readonly exporter: JsonExporterService) {}

	onExport() {
		this.exporter.export({ temp: 21, unit: 'C' }, 'weather.json');
	}
}
```

---

## O - Open-Closed Principle

Komponent by mal byt rozsiritelny bez toho, aby sa musel menit. V Angulari to casto znamena pouzit content projection namiesto if-else podmienok v sablone.

### Zle: rigidny komponent s if/else

```ts
@Component({
	selector: 'app-widget',
	template: `
		<section class="widget">
			<ng-container *ngIf="type === 'weather'; else velocity">
				<h3>Weather</h3>
			</ng-container>
			<ng-template #velocity>
				<h3>Velocity</h3>
			</ng-template>
		</section>
	`,
})
export class WidgetComponent {
	@Input() type: 'weather' | 'velocity' = 'weather';
}
```

### Lepsie: obsah sa projektuje cez ng-content

```ts
@Component({
	selector: 'app-widget',
	template: `
		<section class="widget">
			<ng-content></ng-content>
		</section>
	`,
})
export class WidgetComponent {}
```

```html
<app-widget>
	<app-weather-content></app-weather-content>
</app-widget>

<app-widget>
	<app-velocity-content></app-velocity-content>
</app-widget>

<app-widget>
	<p>Custom content without changing the widget.</p>
</app-widget>
```

---

## L - Liskov Substitution Principle

Potomok musi zachovat kontrakt predka. Ak metoda v potomkovi meni spravanie tak, ze kod, ktory ocakava predka, sa rozbije, LSP je poruseny.

### Zle: potomok meni kontrakt

```ts
@Directive()
export abstract class WidgetBase {
	@Input() title = '';

	exportJson(): void {
		console.log('exporting...');
	}
}

@Component({
	selector: 'app-widget',
	template: `<h3>{{ title }}</h3>`,
})
export class WidgetComponent extends WidgetBase {
	override exportJson(): void {
		throw new Error('Export is not supported');
	}
}
```

### Lepsie: potomok rozsiruje, nie rusi spravanie

```ts
@Component({
	selector: 'app-widget',
	template: `<h3>{{ title }}</h3>`,
})
export class WidgetComponent extends WidgetBase {
	override exportJson(): void {
		super.exportJson();
		console.log('widget export done');
	}
}
```

---

## I - Interface Segregation Principle

Ak rozhranie obsahuje vlastnosti, ktore nie kazda implementacia potrebuje, treba ho rozdelit. Komponenty potom implementuju len to, co realne vyuzivaju.

### Zle: jedna velka zmluva pre vsetky widgety

```ts
export interface WidgetContent {
	id: string;
	loading: boolean;
	reload(): void;
}

@Component({
	selector: 'app-velocity-content',
	template: `<p>Velocity</p>`,
})
export class VelocityContentComponent implements WidgetContent {
	id = 'velocity';
	loading = false;
	reload(): void {
		// not needed, but must be implemented
	}
}
```

### Lepsie: mensie, cielene rozhrania

```ts
export interface WidgetContent {
	id: string;
}

export interface Reloadable {
	loading: boolean;
	reload(): void;
}

@Component({
	selector: 'app-weather-content',
	template: `<p>Weather</p>`,
})
export class WeatherContentComponent implements WidgetContent, Reloadable {
	id = 'weather';
	loading = false;
	reload(): void {
		console.log('polling...');
	}
}

@Component({
	selector: 'app-velocity-content',
	template: `<p>Velocity</p>`,
})
export class VelocityContentComponent implements WidgetContent {
	id = 'velocity';
}
```

---

## D - Dependency Inversion Principle

Vysoko-urovnove komponenty by nemali zavisiet od konkretnych implementacii. V Angulari to riesime pomocou injection tokenov a rozhrani.

### Zle: zavislost na konkretnom komponente

```ts
@Component({
	selector: 'app-widget',
	template: `<ng-content></ng-content>`,
})
export class WidgetComponent implements AfterContentInit {
	@ContentChild(WeatherContentComponent) content?: WeatherContentComponent;

	ngAfterContentInit() {
		this.content?.reload();
	}
}
```

### Lepsie: zavislost na abstrakcii

```ts
export const RELOADABLE_CONTENT = new InjectionToken<Reloadable>('reloadable-content');

@Component({
	selector: 'app-weather-content',
	template: `<p>Weather</p>`,
	providers: [
		{ provide: RELOADABLE_CONTENT, useExisting: WeatherContentComponent },
	],
})
export class WeatherContentComponent implements Reloadable {
	loading = false;
	reload(): void {
		console.log('polling...');
	}
}

@Component({
	selector: 'app-widget',
	template: `<ng-content></ng-content>`,
})
export class WidgetComponent implements AfterContentInit {
	@ContentChild(RELOADABLE_CONTENT) content?: Reloadable;

	ngAfterContentInit() {
		this.content?.reload();
	}
}
```

