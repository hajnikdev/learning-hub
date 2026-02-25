## Obsah

1. [Úvod do Angular Forms](article/angular-forms#úvod-do-angular-forms)
2. [Template-driven Forms](article/angular-forms#template-driven-forms)
   - [Registrácia formulára a inputov](article/angular-forms#registrácia-formulára-a-inputov)
   - [Prístup k formuláru cez ngForm](article/angular-forms#prístup-k-formuláru-cez-ngform)
   - [Validácia v Template-driven Forms](article/angular-forms#validácia-v-template-driven-forms)
   - [Zobrazenie chybových hlásení](article/angular-forms#zobrazenie-chybových-hlásení)
   - [CSS triedy pre validáciu](article/angular-forms#css-triedy-pre-validáciu)
   - [Resetovanie formulára](article/angular-forms#resetovanie-formulára)
   - [ValueChanges Observable](article/angular-forms#valuechanges-observable)
   - [Predvyplnenie formulára](article/angular-forms#predvyplnenie-formulára)
3. [Reactive Forms](article/angular-forms#reactive-forms)
   - [Vytvorenie reaktívneho formulára](article/angular-forms#vytvorenie-reaktívneho-formulára)
   - [Pripojenie formulára k template](article/angular-forms#pripojenie-formulára-k-template)
   - [Validácia v Reactive Forms](article/angular-forms#validácia-v-reactive-forms)
   - [Vlastné validátory](article/angular-forms#vlastné-validátory)
   - [Async validátory](article/angular-forms#async-validátory)
   - [PatchValue a SetValue](article/angular-forms#patchvalue-a-setvalue)
4. [Pokročilé koncepty](article/angular-forms#pokročilé-koncepty)
   - [Vnorené FormGroups](article/angular-forms#vnorené-formgroups)
   - [FormArray](article/angular-forms#formarray)
   - [Validácia skupiny controlов](article/angular-forms#validácia-skupiny-controlov)
   - [Factory validátory](article/angular-forms#factory-validátory)

---

## Úvod do Angular Forms

Angular poskytuje **dva hlavné prístupy** k práci s formulármi:

1. **Template-driven Forms** - formulár sa definuje v template, jednoduché na začiatok
2. **Reactive Forms** - formulár sa definuje v TypeScript kóde, vhodné pre komplexnejšie formuláre

### Kedy použiť Template-driven Forms?

- Jednoduché formuláre
- Rýchly prototyping
- Formuláre s minimálnou logikou

### Kedy použiť Reactive Forms?

- Komplexné formuláre
- Dynamické formuláre
- Pokročilá validácia
- Lepšia testovateľnosť
- Lepšia TypeScript podpora

---

## Template-driven Forms

Template-driven prístup umožňuje definovať formulár pomocou direktív priamo v HTML template.

### Registrácia formulára a inputov

**Krok 1:** Import `FormsModule` v komponente

```typescript
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html'
})
export class LoginComponent {}
```

**Krok 2:** Použitie `ngModel` direktívy s atribútom `name`

```html
<form>
  <div>
    <label for="email">Email:</label>
    <input 
      type="email" 
      id="email" 
      name="email" 
      ngModel>
  </div>
  
  <div>
    <label for="password">Heslo:</label>
    <input 
      type="password" 
      id="password" 
      name="password" 
      ngModel>
  </div>
  
  <button type="submit">Prihlásiť</button>
</form>
```

**Dôležité:**
- Každý input s `ngModel` **musí mať** atribút `name`
- Angular používa `name` na interné registrovanie inputu

### Prístup k formuláru cez ngForm

Template premenná s `ngForm` poskytuje prístup k Angular formulárovému objektu:

```html
<form #loginForm="ngForm" (ngSubmit)="onSubmit(loginForm)">
  <div>
    <label for="email">Email:</label>
    <input 
      type="email" 
      id="email" 
      name="email" 
      ngModel>
  </div>
  
  <div>
    <label for="password">Heslo:</label>
    <input 
      type="password" 
      id="password" 
      name="password" 
      ngModel>
  </div>
  
  <button type="submit">Prihlásiť</button>
</form>
```

```typescript
import { NgForm } from '@angular/forms';

export class LoginComponent {
  onSubmit(form: NgForm) {
    console.log(form.value); // { email: '...', password: '...' }
    console.log(form.valid); // true/false
    console.log(form.touched); // true/false
    console.log(form.dirty); // true/false
  }
}
```

**Štruktúra NgForm objektu:**
- `value` - hodnoty všetkých inputov
- `valid` - je formulár validný
- `invalid` - je formulár nevalidný
- `touched` - používateľ interagoval s formulárom
- `pristine` - formulár nebol zmenený
- `dirty` - formulár bol zmenený
- `controls` - objekty jednotlivých controlов

### Validácia v Template-driven Forms

Validácia sa pridáva pomocou HTML atribútov/Angular direktív:

```html
<form #loginForm="ngForm" (ngSubmit)="onSubmit(loginForm)">
  <div>
    <label for="email">Email:</label>
    <input 
      type="email" 
      id="email" 
      name="email" 
      ngModel
      required
      email>
  </div>
  
  <div>
    <label for="password">Heslo:</label>
    <input 
      type="password" 
      id="password" 
      name="password" 
      ngModel
      required
      minlength="6">
  </div>
  
  <button type="submit">Prihlásiť</button>
</form>
```

**Dostupné validátory:**
- `required` - povinné pole
- `email` - validný email formát
- `minlength="6"` - minimálna dĺžka
- `maxlength="100"` - maximálna dĺžka
- `min="0"` - minimálna číselná hodnota
- `max="100"` - maximálna číselná hodnota
- `pattern="[a-zA-Z]*"` - regulárny výraz

### Zobrazenie chybových hlásení

**Prístup k control-špecifickým informáciám:**

```html
<form #loginForm="ngForm" (ngSubmit)="onSubmit(loginForm)">
  <div>
    <label for="email">Email:</label>
    <input 
      type="email" 
      id="email" 
      name="email" 
      #emailCtrl="ngModel"
      ngModel
      required
      email>
    
    @if (emailCtrl.touched && emailCtrl.dirty && emailCtrl.invalid) {
      <p class="error">Prosím zadajte validný email.</p>
    }
  </div>
  
  <div>
    <label for="password">Heslo:</label>
    <input 
      type="password" 
      id="password" 
      name="password" 
      #passwordCtrl="ngModel"
      ngModel
      required
      minlength="6">
    
    @if (passwordCtrl.touched && passwordCtrl.dirty && passwordCtrl.invalid) {
      <p class="error">Heslo musí mať minimálne 6 znakov.</p>
    }
  </div>
  
  <button type="submit">Prihlásiť</button>
</form>
```

**Globálna chyba formulára:**

```html
@if (loginForm.invalid && loginForm.touched) {
  <p class="error">Neplatné údaje - skontrolujte formulár.</p>
}
```

### CSS triedy pre validáciu

Angular automaticky pridáva CSS triedy na inputy s `ngModel`:

- `.ng-valid` / `.ng-invalid` - validný/nevalidný stav
- `.ng-touched` / `.ng-untouched` - používateľ klikol do inputu
- `.ng-dirty` / `.ng-pristine` - hodnota bola zmenená

**Príklad štýlovania:**

```css
input.ng-invalid.ng-touched {
  border: 2px solid red;
}

input.ng-valid.ng-touched {
  border: 2px solid green;
}
```

### Resetovanie formulára

```typescript
export class LoginComponent {
  onSubmit(form: NgForm) {
    if (form.invalid) {
      return;
    }
    
    console.log(form.value);
    
    // Resetovanie formulára
    form.reset();
  }
}
```

**Metóda `reset()` vykoná:**
- Vyčistí všetky hodnoty
- Nastaví `pristine` na true
- Nastaví `untouched` na true
- Odstráni validačné chyby

### ValueChanges Observable

Sledovanie zmien vo formulári v reálnom čase:

```typescript
import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { debounceTime } from 'rxjs';

export class LoginComponent implements AfterViewInit {
  @ViewChild('loginForm') form?: NgForm;
  
  ngAfterViewInit() {
    this.form?.valueChanges
      ?.pipe(debounceTime(500))
      .subscribe(value => {
        console.log('Formulár sa zmenil:', value);
        
        // Uloženie do localStorage
        localStorage.setItem('draft-login', JSON.stringify(value));
      });
  }
}
```

**Operator `debounceTime`:**
- Čaká zadaný čas (500ms) pred emitovaním hodnoty
- Užitočné pre predchádzanie príliš častým aktualizáciám

### Predvyplnenie formulára

**Načítanie uložených údajov:**

```typescript
import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

export class LoginComponent implements AfterViewInit {
  @ViewChild('loginForm') form?: NgForm;
  
  ngAfterViewInit() {
    // Načítanie z localStorage
    const savedData = localStorage.getItem('draft-login');
    
    if (savedData) {
      const data = JSON.parse(savedData);
      
      // Krátke oneskorenie pre inicializáciu formulára
      setTimeout(() => {
        this.form?.controls['email'].setValue(data.email);
      }, 1);
    }
  }
}
```

---

## Reactive Forms

Reactive forms poskytujú model-driven prístup, kde je formulár definovaný v TypeScript kóde.

### Vytvorenie reaktívneho formulára

**Krok 1:** Import `ReactiveFormsModule`

```typescript
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  loginForm = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      Validators.email
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6)
    ])
  });
  
  onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }
    
    console.log(this.loginForm.value);
    // { email: '...', password: '...' }
    
    // Type-safe prístup
    const email = this.loginForm.value.email;
    const password = this.loginForm.value.password;
  }
}
```

### Pripojenie formulára k template

```html
<form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
  <div>
    <label for="email">Email:</label>
    <input 
      type="email" 
      id="email" 
      formControlName="email">
  </div>
  
  <div>
    <label for="password">Heslo:</label>
    <input 
      type="password" 
      id="password" 
      formControlName="password">
  </div>
  
  <button type="submit">Prihlásiť</button>
</form>
```

**Direktívy:**
- `[formGroup]="loginForm"` - pripojí FormGroup k `<form>` elementu
- `formControlName="email"` - pripojí FormControl k inputu

### Validácia v Reactive Forms

**Zobrazenie chýb pomocou getters:**

```typescript
export class LoginComponent {
  loginForm = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      Validators.email
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6)
    ])
  });
  
  get emailIsInvalid() {
    const email = this.loginForm.controls.email;
    return email.touched && email.dirty && email.invalid;
  }
  
  get passwordIsInvalid() {
    const password = this.loginForm.controls.password;
    return password.touched && password.dirty && password.invalid;
  }
  
  onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }
    
    console.log(this.loginForm.value);
  }
}
```

**Template:**

```html
<form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
  <div>
    <label for="email">Email:</label>
    <input 
      type="email" 
      id="email" 
      formControlName="email">
    
    @if (emailIsInvalid) {
      <p class="error">Prosím zadajte validný email.</p>
    }
  </div>
  
  <div>
    <label for="password">Heslo:</label>
    <input 
      type="password" 
      id="password" 
      formControlName="password">
    
    @if (passwordIsInvalid) {
      <p class="error">Heslo musí mať minimálne 6 znakov.</p>
    }
  </div>
  
  <button type="submit">Prihlásiť</button>
</form>
```

### Vlastné validátory

Vlastný validátor je funkcia, ktorá prijíma `AbstractControl` a vracia `null` (validné) alebo objekt s chybou (nevalidné).

```typescript
import { AbstractControl, ValidationErrors } from '@angular/forms';

// Validátor funkcia
function mustContainQuestionMark(control: AbstractControl): ValidationErrors | null {
  if (control.value.includes('?')) {
    return null; // Validné
  }
  
  return { mustContainQuestionMark: true }; // Nevalidné
}

// Použitie v komponente
export class LoginComponent {
  loginForm = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      Validators.email
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
      mustContainQuestionMark // Vlastný validátor
    ])
  });
}
```

**Kontrola špecifickej chyby:**

```typescript
get passwordError() {
  const password = this.loginForm.controls.password;
  
  if (password.hasError('required')) {
    return 'Heslo je povinné.';
  }
  
  if (password.hasError('minlength')) {
    return 'Heslo musí mať minimálne 6 znakov.';
  }
  
  if (password.hasError('mustContainQuestionMark')) {
    return 'Heslo musí obsahovať otáznik.';
  }
  
  return null;
}
```

### Async validátory

Async validátory vrací `Observable<ValidationErrors | null>` - užitočné pre server-side validáciu.

```typescript
import { AbstractControl, ValidationErrors } from '@angular/forms';
import { Observable, of, delay } from 'rxjs';

// Simulácia server kontroly
function emailIsUnique(control: AbstractControl): Observable<ValidationErrors | null> {
  const email = control.value;
  
  // Simulácia HTTP requestu (v realite použite HttpClient)
  return of(email === 'test@example.com').pipe(
    delay(1000), // Simulácia network delay
    map(isTaken => {
      return isTaken ? { emailNotUnique: true } : null;
    })
  );
}

// Použitie
export class SignupComponent {
  signupForm = new FormGroup({
    email: new FormControl('', {
      validators: [Validators.required, Validators.email],
      asyncValidators: [emailIsUnique]
    })
  });
}
```

**Template s pending stavom:**

```html
<div>
  <label for="email">Email:</label>
  <input 
    type="email" 
    id="email" 
    formControlName="email">
  
  @if (signupForm.controls.email.pending) {
    <p>Kontrolujem dostupnosť emailu...</p>
  }
  
  @if (signupForm.controls.email.hasError('emailNotUnique')) {
    <p class="error">Tento email už je registrovaný.</p>
  }
</div>
```

### PatchValue a SetValue

**`setValue()` - nastaví všetky hodnoty formulára:**

```typescript
this.loginForm.setValue({
  email: 'user@example.com',
  password: 'password123'
});

// Chyba ak chýba nejaká hodnota!
// this.loginForm.setValue({ email: 'user@example.com' }); // ERROR
```

**`patchValue()` - nastaví len niektoré hodnoty:**

```typescript
// Nastaví len email, password zostane nezmenený
this.loginForm.patchValue({
  email: 'user@example.com'
});
```

**Načítanie z localStorage pri inicializácii:**

```typescript
import { Component, OnInit } from '@angular/core';

export class LoginComponent implements OnInit {
  loginForm = new FormGroup({
    email: new FormControl(''),
    password: new FormControl('')
  });
  
  ngOnInit() {
    const savedEmail = localStorage.getItem('saved-email');
    
    if (savedEmail) {
      this.loginForm.patchValue({
        email: savedEmail
      });
    }
  }
}
```

---

## Pokročilé koncepty

### Vnorené FormGroups

Vnorené `FormGroup` objekty umožňujú štruktúrovať komplexné formuláre.

```typescript
export class SignupComponent {
  signupForm = new FormGroup({
    // Osobné údaje
    personalInfo: new FormGroup({
      firstName: new FormControl('', Validators.required),
      lastName: new FormControl('', Validators.required)
    }),
    
    // Adresa
    address: new FormGroup({
      street: new FormControl('', Validators.required),
      city: new FormControl('', Validators.required),
      postalCode: new FormControl('', Validators.required)
    }),
    
    // Heslá
    passwords: new FormGroup({
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6)
      ]),
      confirmPassword: new FormControl('', Validators.required)
    })
  });
  
  onSubmit() {
    console.log(this.signupForm.value);
    /* {
      personalInfo: { firstName: '...', lastName: '...' },
      address: { street: '...', city: '...', postalCode: '...' },
      passwords: { password: '...', confirmPassword: '...' }
    } */
  }
}
```

**Template s `formGroupName`:**

```html
<form [formGroup]="signupForm" (ngSubmit)="onSubmit()">
  <!-- Osobné údaje -->
  <fieldset formGroupName="personalInfo">
    <legend>Osobné údaje</legend>
    
    <input formControlName="firstName" placeholder="Meno">
    <input formControlName="lastName" placeholder="Priezvisko">
  </fieldset>
  
  <!-- Adresa -->
  <fieldset formGroupName="address">
    <legend>Adresa</legend>
    
    <input formControlName="street" placeholder="Ulica">
    <input formControlName="city" placeholder="Mesto">
    <input formControlName="postalCode" placeholder="PSČ">
  </fieldset>
  
  <!-- Heslá -->
  <div formGroupName="passwords">
    <input type="password" formControlName="password" placeholder="Heslo">
    <input type="password" formControlName="confirmPassword" placeholder="Potvrdiť heslo">
  </div>
  
  <button type="submit">Registrovať</button>
</form>
```

### FormArray

`FormArray` je zoznam FormControl/FormGroup objektov - užitočné pre dynamické formuláre.

```typescript
export class SurveyComponent {
  surveyForm = new FormGroup({
    name: new FormControl('', Validators.required),
    
    // Zoznam checkboxov
    interests: new FormArray([
      new FormControl(false), // Angular
      new FormControl(false), // React
      new FormControl(false)  // Vue
    ])
  });
  
  onSubmit() {
    console.log(this.surveyForm.value);
    /* {
      name: 'Ján Novák',
      interests: [true, false, true]
    } */
  }
}
```

**Template s FormArray:**

```html
<form [formGroup]="surveyForm" (ngSubmit)="onSubmit()">
  <input formControlName="name" placeholder="Meno">
  
  <fieldset formArrayName="interests">
    <legend>Vaše záujmy:</legend>
    
    <label>
      <input type="checkbox" [formControlName]="0">
      Angular
    </label>
    
    <label>
      <input type="checkbox" [formControlName]="1">
      React
    </label>
    
    <label>
      <input type="checkbox" [formControlName]="2">
      Vue
    </label>
  </fieldset>
  
  <button type="submit">Odoslať</button>
</form>
```

**Dynamické pridávanie položiek:**

```typescript
import { FormArray } from '@angular/forms';

export class TaskListComponent {
  taskForm = new FormGroup({
    tasks: new FormArray<FormControl<string>>([])
  });
  
  get tasks() {
    return this.taskForm.controls.tasks;
  }
  
  addTask() {
    this.tasks.push(new FormControl('', Validators.required));
  }
  
  removeTask(index: number) {
    this.tasks.removeAt(index);
  }
  
  onSubmit() {
    console.log(this.taskForm.value.tasks);
    // ['Úloha 1', 'Úloha 2', ...]
  }
}
```

**Template s dynamickým FormArray:**

```html
<form [formGroup]="taskForm" (ngSubmit)="onSubmit()">
  <div formArrayName="tasks">
    @for (task of tasks.controls; track $index) {
      <div>
        <input [formControlName]="$index" placeholder="Úloha">
        <button type="button" (click)="removeTask($index)">Odstrániť</button>
      </div>
    }
  </div>
  
  <button type="button" (click)="addTask()">Pridať úlohu</button>
  <button type="submit">Uložiť</button>
</form>
```

### Validácia skupiny controlov

Validátor na úrovni `FormGroup` pre porovnanie dvoch polí:

```typescript
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

// Validátor pre porovnanie dvoch hodnôt
function equalValues(controlName1: string, controlName2: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value1 = control.get(controlName1)?.value;
    const value2 = control.get(controlName2)?.value;
    
    if (value1 === value2) {
      return null; // Validné
    }
    
    return { valuesNotEqual: true }; // Nevalidné
  };
}

// Použitie
export class SignupComponent {
  signupForm = new FormGroup({
    passwords: new FormGroup({
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6)
      ]),
      confirmPassword: new FormControl('', Validators.required)
    }, {
      validators: equalValues('password', 'confirmPassword')
    })
  });
  
  get passwordsNotEqual() {
    return this.signupForm.controls.passwords.hasError('valuesNotEqual');
  }
}
```

**Template:**

```html
<div formGroupName="passwords">
  <input type="password" formControlName="password" placeholder="Heslo">
  <input type="password" formControlName="confirmPassword" placeholder="Potvrdiť heslo">
  
  @if (passwordsNotEqual) {
    <p class="error">Heslá sa nezhodujú.</p>
  }
</div>
```

### Factory validátory

Factory funkcia, ktorá vytvára validátor s konfiguráciou:

```typescript
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

// Factory funkcia pre vytvorenie validátora
function forbiddenValue(forbiddenVal: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (control.value === forbiddenVal) {
      return { forbiddenValue: { value: forbiddenVal } };
    }
    return null;
  };
}

// Použitie
export class UserComponent {
  userForm = new FormGroup({
    username: new FormControl('', [
      Validators.required,
      forbiddenValue('admin'), // Zakázané meno
      forbiddenValue('root')   // Zakázané meno
    ])
  });
}
```

**Regex validátor:**

```typescript
function mustContainPattern(pattern: RegExp, errorKey: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null; // Nechať required validátor
    }
    
    const valid = pattern.test(control.value);
    return valid ? null : { [errorKey]: true };
  };
}

// Použitie
export class PasswordComponent {
  form = new FormGroup({
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      mustContainPattern(/[A-Z]/, 'noUppercase'),
      mustContainPattern(/[0-9]/, 'noNumber'),
      mustContainPattern(/[@$!%*?&]/, 'noSpecialChar')
    ])
  });
  
  get passwordErrors() {
    const errors = this.form.controls.password.errors;
    if (!errors) return null;
    
    if (errors['noUppercase']) return 'Musí obsahovať veľké písmeno';
    if (errors['noNumber']) return 'Musí obsahovať číslo';
    if (errors['noSpecialChar']) return 'Musí obsahovať špeciálny znak';
    
    return null;
  }
}
```

---

## Zhrnutie

### Template-driven vs Reactive Forms

| Aspekt | Template-driven | Reactive |
|--------|----------------|----------|
| **Definícia** | V template (HTML) | V TypeScript kóde |
| **Import** | `FormsModule` | `ReactiveFormsModule` |
| **Komplexnosť** | Jednoduchšie | Viac kódu na setup |
| **TypeScript podpora** | Slabšia | Silná |
| **Testovateľnosť** | Ťažšie | Jednoduchšie |
| **Dynamické formuláre** | Obtiažne | Jednoduché |
| **Vlastné validátory** | Potrebné direktívy | Jednoduché funkcie |

### Kľúčové koncepty

- **FormsModule** - pre template-driven forms
- **ReactiveFormsModule** - pre reactive forms
- **ngModel** - registrácia inputu (template-driven)
- **FormControl** - jediný input control
- **FormGroup** - skupina controlов
- **FormArray** - pole controlов
- **Validators** - vstavaní validátory
- **Custom Validators** - vlastné validačné funkcie
- **valueChanges** - Observable pre sledovanie zmien
- **setValue/patchValue** - nastavenie hodnôt programovo

Angular Forms poskytujú výkonný a flexibilný spôsob práce s formulármi. Template-driven prístup je ideálny pre jednoduché formuláre, zatiaľ čo Reactive Forms ponúkajú plnú kontrolu a sú vhodné pre komplexné scenáre.
