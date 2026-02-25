# Angular Forms - Cheatsheet

## Template-driven vs Reactive Forms

| Vlastnosť | Template-driven | Reactive |
|-----------|----------------|----------|
| **Setup** | FormsModule | ReactiveFormsModule |
| **Definícia** | V template (HTML) | V TypeScript |
| **Jednoduchosť** | ✅ Jednoduché | ⚠️ Viac kódu |
| **Type Safety** | ❌ Slabá | ✅ Silná |
| **Testovanie** | ⚠️ Ťažšie | ✅ Jednoduché |
| **Dynamika** | ❌ Obtiažne | ✅ Jednoduché |

---

## Template-driven Forms

### Základný setup

```typescript
// Component
import { FormsModule } from '@angular/forms';

@Component({
  imports: [FormsModule]
})
```

```html
<!-- Template -->
<form #f="ngForm" (ngSubmit)="onSubmit(f)">
  <input name="email" ngModel required email>
  <input name="password" ngModel required minlength="6">
  <button type="submit">Odoslať</button>
</form>
```

### Prístup k kontrolom

```html
<input name="email" #emailCtrl="ngModel" ngModel required>

@if (emailCtrl.invalid && emailCtrl.touched) {
  <p>Neplatný email</p>
}
```

### Validátory

| Validátor | Použitie |
|-----------|----------|
| `required` | Povinné pole |
| `email` | Email formát |
| `minlength="6"` | Min dĺžka |
| `maxlength="100"` | Max dĺžka |
| `min="0"` | Min číslo |
| `max="100"` | Max číslo |
| `pattern="regex"` | Regex |

### CSS triedy

```css
.ng-valid { }      /* Validný */
.ng-invalid { }    /* Nevalidný */
.ng-touched { }    /* Dotknutý */
.ng-untouched { }  /* Nedotknutý */
.ng-dirty { }      /* Zmenený */
.ng-pristine { }   /* Nezmenený */
```

### ValueChanges

```typescript
@ViewChild('f') form?: NgForm;

ngAfterViewInit() {
  this.form?.valueChanges
    ?.pipe(debounceTime(500))
    .subscribe(value => {
      localStorage.setItem('draft', JSON.stringify(value));
    });
}
```

---

## Reactive Forms

### Základný setup

```typescript
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  imports: [ReactiveFormsModule]
})
export class MyComponent {
  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)])
  });
  
  onSubmit() {
    if (this.form.invalid) return;
    console.log(this.form.value);
  }
}
```

```html
<form [formGroup]="form" (ngSubmit)="onSubmit()">
  <input formControlName="email">
  <input formControlName="password">
  <button type="submit">Odoslať</button>
</form>
```

### Vstavaní validátory

```typescript
Validators.required
Validators.email
Validators.min(0)
Validators.max(100)
Validators.minLength(6)
Validators.maxLength(100)
Validators.pattern(/regex/)
```

### Vlastný validátor

```typescript
// Jednoduchý
function mustContain(char: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    return control.value?.includes(char) ? null : { mustContain: true };
  };
}

// Async
function emailUnique(control: AbstractControl): Observable<ValidationErrors | null> {
  return http.get(`/api/check-email/${control.value}`).pipe(
    map(exists => exists ? { emailTaken: true } : null)
  );
}

// Použitie
new FormControl('', {
  validators: [Validators.required, mustContain('?')],
  asyncValidators: [emailUnique]
})
```

### Getters pre validáciu

```typescript
get emailInvalid() {
  const email = this.form.controls.email;
  return email.touched && email.dirty && email.invalid;
}
```

```html
@if (emailInvalid) {
  <p class="error">Neplatný email</p>
}
```

### SetValue vs PatchValue

```typescript
// setValue - všetky hodnoty musia byť poskytnuté
this.form.setValue({
  email: 'test@test.com',
  password: '123456'
});

// patchValue - môžete nastaviť len niektoré
this.form.patchValue({
  email: 'test@test.com'
  // password zostane nezmenený
});
```

---

## Pokročilé koncepty

### Vnorené FormGroups

```typescript
form = new FormGroup({
  personalInfo: new FormGroup({
    firstName: new FormControl(''),
    lastName: new FormControl('')
  }),
  address: new FormGroup({
    street: new FormControl(''),
    city: new FormControl('')
  })
});
```

```html
<form [formGroup]="form">
  <div formGroupName="personalInfo">
    <input formControlName="firstName">
    <input formControlName="lastName">
  </div>
  
  <div formGroupName="address">
    <input formControlName="street">
    <input formControlName="city">
  </div>
</form>
```

### FormArray

```typescript
form = new FormGroup({
  items: new FormArray([
    new FormControl(''),
    new FormControl('')
  ])
});

get items() {
  return this.form.controls.items;
}

addItem() {
  this.items.push(new FormControl(''));
}

removeItem(index: number) {
  this.items.removeAt(index);
}
```

```html
<div formArrayName="items">
  @for (item of items.controls; track $index) {
    <input [formControlName]="$index">
    <button (click)="removeItem($index)">X</button>
  }
</div>
<button (click)="addItem()">Pridať</button>
```

### Validátor pre skupinu

```typescript
function equalValues(controlName1: string, controlName2: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const val1 = control.get(controlName1)?.value;
    const val2 = control.get(controlName2)?.value;
    return val1 === val2 ? null : { notEqual: true };
  };
}

// Použitie
passwords: new FormGroup({
  password: new FormControl(''),
  confirm: new FormControl('')
}, {
  validators: equalValues('password', 'confirm')
})
```

---

## Užitočné metódy

### FormGroup/FormControl

```typescript
// Stav
form.valid          // je validný?
form.invalid        // je nevalidný?
form.touched        // bol dotknutý?
form.untouched      // nebol dotknutý?
form.dirty          // bol zmenený?
form.pristine       // nebol zmenený?
form.pending        // async validácia beží?

// Hodnoty
form.value          // všetky hodnoty
form.getRawValue()  // aj disabled hodnoty

// Manipulácia
form.setValue({ })      // nastaviť všetko
form.patchValue({ })    // nastaviť časť
form.reset()            // resetovať
form.markAsTouched()    // označiť ako dotknutý
form.markAsUntouched()  // označiť ako nedotknutý
form.markAsDirty()      // označiť ako zmenený
form.markAsPristine()   // označiť ako nezmenený

// Validácia
form.hasError('required')      // má chybu?
form.getError('required')      // získať chybu
form.setErrors({ custom: true }) // nastaviť chybu
form.clearValidators()         // odstrániť validátory
form.setValidators([])         // nastaviť validátory
form.updateValueAndValidity()  // znova validovať

// Enable/Disable
form.enable()    // povoliť
form.disable()   // zakázať
```

### FormArray

```typescript
array.push(control)      // pridať
array.insert(i, control) // vložiť na pozíciu
array.removeAt(i)        // odstrániť na pozícii
array.clear()            // vyčistiť všetko
array.at(i)              // získať control
array.length             // dĺžka
```

---

## Rýchle príklady

### Kompletný login form

```typescript
// Component
export class LoginComponent {
  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)])
  });
  
  get emailInvalid() {
    const c = this.form.controls.email;
    return c.touched && c.invalid;
  }
  
  get passwordInvalid() {
    const c = this.form.controls.password;
    return c.touched && c.invalid;
  }
  
  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    
    const { email, password } = this.form.value;
    // Odoslať na server
  }
}
```

```html
<!-- Template -->
<form [formGroup]="form" (ngSubmit)="onSubmit()">
  <div>
    <input type="email" formControlName="email" placeholder="Email">
    @if (emailInvalid) {
      <span class="error">Neplatný email</span>
    }
  </div>
  
  <div>
    <input type="password" formControlName="password" placeholder="Heslo">
    @if (passwordInvalid) {
      <span class="error">Minimálne 6 znakov</span>
    }
  </div>
  
  <button type="submit" [disabled]="form.invalid">Prihlásiť</button>
</form>
```

### Dynamický formulár

```typescript
export class DynamicFormComponent {
  form = new FormGroup({
    items: new FormArray<FormGroup>([])
  });
  
  get itemsArray() {
    return this.form.controls.items;
  }
  
  addItem() {
    const item = new FormGroup({
      name: new FormControl('', Validators.required),
      quantity: new FormControl(1, [Validators.required, Validators.min(1)])
    });
    this.itemsArray.push(item);
  }
  
  removeItem(index: number) {
    this.itemsArray.removeAt(index);
  }
  
  onSubmit() {
    console.log(this.form.value);
  }
}
```

```html
<form [formGroup]="form" (ngSubmit)="onSubmit()">
  <div formArrayName="items">
    @for (item of itemsArray.controls; track $index) {
      <div [formGroupName]="$index">
        <input formControlName="name" placeholder="Názov">
        <input type="number" formControlName="quantity" placeholder="Množstvo">
        <button type="button" (click)="removeItem($index)">Odstrániť</button>
      </div>
    }
  </div>
  
  <button type="button" (click)="addItem()">Pridať položku</button>
  <button type="submit">Uložiť</button>
</form>
```

---

## Tipy & Triky

### 1. Označiť všetky polia ako touched

```typescript
markFormGroupTouched(formGroup: FormGroup) {
  Object.keys(formGroup.controls).forEach(key => {
    const control = formGroup.get(key);
    control?.markAsTouched();
    
    if (control instanceof FormGroup) {
      this.markFormGroupTouched(control);
    }
  });
}

// Použitie pri submite
onSubmit() {
  if (this.form.invalid) {
    this.markFormGroupTouched(this.form);
    return;
  }
}
```

### 2. Sledovanie zmien konkrétneho controlu

```typescript
ngOnInit() {
  this.form.controls.email.valueChanges
    .pipe(debounceTime(300))
    .subscribe(value => {
      console.log('Email changed:', value);
    });
}
```

### 3. Podmienená validácia

```typescript
ngOnInit() {
  this.form.controls.country.valueChanges.subscribe(country => {
    const stateControl = this.form.controls.state;
    
    if (country === 'USA') {
      stateControl.setValidators([Validators.required]);
    } else {
      stateControl.clearValidators();
    }
    
    stateControl.updateValueAndValidity();
  });
}
```

### 4. Async validácia s debounce

```typescript
function asyncValidator(http: HttpClient): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    return timer(500).pipe(
      switchMap(() => http.get(`/api/validate/${control.value}`)),
      map(result => result.valid ? null : { invalid: true }),
      catchError(() => of(null))
    );
  };
}
```

### 5. Formulár z JSON konfigurácie

```typescript
buildForm(config: any) {
  const group: any = {};
  
  config.forEach((field: any) => {
    group[field.name] = new FormControl(
      field.value || '',
      field.validators || []
    );
  });
  
  return new FormGroup(group);
}

// Použitie
const config = [
  { name: 'email', validators: [Validators.required, Validators.email] },
  { name: 'password', validators: [Validators.required, Validators.minLength(6)] }
];

this.form = this.buildForm(config);
```
