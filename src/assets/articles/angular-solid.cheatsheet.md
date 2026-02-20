## Angular SOLID Cheatsheet

### Prehlad

- **S**ingle Responsibility: jedna zodpovednost na triedu/komponent
- **O**pen-Closed: otvorene pre rozsirenie, zatvorene pre modifikaciu
- **L**iskov Substitution: potomok musi zachovat kontrakt predka
- **I**nterface Segregation: viac malych rozhrani namiesto jedneho velkeho
- **D**ependency Inversion: zavisiet od abstrakcii, nie od konkretnych tried

---

### S - Single Responsibility Principle

- Komponent/trieda ma **jeden dovod na zmenu**.
- Signal: pri popise zodpovednosti pouzijes slovo "a".
- Rozdel UI, logiku a export do samostatnych entit (komponent + service).

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
```

---

### O - Open-Closed Principle

- Komponent ma byt **rozsiritelny bez zmeny zdroja**.
- V UI preferuj `ng-content` pred `*ngIf` vetvenim.

```ts
@Component({
	selector: 'app-widget',
	template: `<section class="widget"><ng-content></ng-content></section>`,
})
export class WidgetComponent {}
```

```html
<app-widget>
	<app-weather-content></app-weather-content>
</app-widget>
```

---

### L - Liskov Substitution Principle

- Potomok **nesmie zmenit kontrakt** predka.
- Nevyhadzuj chyby ani nemen typy/ocakavane spravanie.

```ts
@Directive()
export abstract class WidgetBase {
	exportJson(): void {
		console.log('exporting...');
	}
}

@Component({ selector: 'app-widget', template: '' })
export class WidgetComponent extends WidgetBase {
	override exportJson(): void {
		super.exportJson();
		console.log('widget export done');
	}
}
```

---

### I - Interface Segregation Principle

- Nenuť komponenty implementovat metody, ktore nepotrebuju.
- Rozdel velke rozhranie na mensie.

```ts
export interface WidgetContent {
	id: string;
}

export interface Reloadable {
	loading: boolean;
	reload(): void;
}
```

---

### D - Dependency Inversion Principle

- Vysoko-urovnove komponenty zavisia od **abstrakcii**.
- V Angulari pouzi **InjectionToken** namiesto priamej zavislosti.

```ts
export const RELOADABLE_CONTENT = new InjectionToken<Reloadable>('reloadable-content');

@Component({
	selector: 'app-weather-content',
	template: `<p>Weather</p>`,
	providers: [{ provide: RELOADABLE_CONTENT, useExisting: WeatherContentComponent }],
})
export class WeatherContentComponent implements Reloadable {
	loading = false;
	reload(): void {
		console.log('polling...');
	}
}
```

```ts
@Component({ selector: 'app-widget', template: `<ng-content></ng-content>` })
export class WidgetComponent implements AfterContentInit {
	@ContentChild(RELOADABLE_CONTENT) content?: Reloadable;

	ngAfterContentInit() {
		this.content?.reload();
	}
}
```

---

### Quick Reference

- **S:** rozdel UI a logiku (komponent + service)
- **O:** `ng-content` pre rozsirenie bez zmeny
- **L:** potomok nerusi kontrakt, len rozsiruje
- **I:** male rozhrania namiesto jedneho velkeho
- **D:** `InjectionToken` + rozhrania, nie konkretne triedy
