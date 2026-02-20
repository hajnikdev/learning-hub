## Obsah

## Čo je API

API znamená **_Application Programming Interface_**, teda aplikačné programové rozhranie. Samotný názov však nie je veľmi vysvetľujúci, preto je lepšie si ho zjednodušiť. API je **spôsob**, akým si **aplikácie medzi sebou vymieňajú dáta**, a je zodpovedné za ich prenos medzi rôznymi systémami.

## Úloha API v dnešnom svete

V dnešnom technologicky prepojenom svete sú aplikácie navzájom úzko prepojené. API predstavuje kľúčový mechanizmus na zdieľanie informácií medzi viacerými aplikáciami. Umožňuje komunikáciu medzi webovými aplikáciami, mobilnými aplikáciami, desktopovými aplikáciami (napríklad Windows aplikáciami) a externými systémami tretích strán.

## Ako API funguje v programovaní

V programovaní klient, napríklad aplikácia, pošle API požiadavku (request). API túto požiadavku spracuje a následne pošle späť odpoveď (response) s požadovanými dátami. Tento proces prebieha neustále, pretože medzi klientom a API dochádza k veľkému množstvu požiadaviek a odpovedí.

## API vs. webová stránka

Webovú stránku zvyčajne volá internetový prehliadač, zatiaľ čo API môže volať akýkoľvek typ aplikácie, nielen prehliadač. API endpointy môžu byť verejné, súkromné alebo určené len pre partnerov.

## Príklad z reálneho sveta – reštaurácia

Zákazník si v reštaurácii vyberá jedlo z menu a rozhoduje sa, čo si objedná, čo predstavuje požiadavku. Čašník, ktorý tu vystupuje ako server alebo API, preberá objednávku a odovzdáva ju kuchárovi. Po tom, ako kuchár jedlo pripraví, čašník ho donesie späť k stolu, čo predstavuje odpoveď. Čašník teda funguje podobne ako API, pretože prijíma požiadavky a vracia odpovede.

## Web ako samozrejmosť

V dnešnom svete berieme web ako samozrejmosť. Keď otvoríme prehliadač a zadáme webovú stránku, automaticky očakávame, že sa stránka načíta a bude fungovať. Pre používateľa ide o bežné správanie, no v pozadí sa skrýva množstvo procesov, ktoré nevidíme. Medzi zadaním požiadavky v prehliadači a zobrazením výsledku na obrazovke sa odohráva veľa krokov.

## Vznik požiadavky

Keď v prehliadači stlačíme kláves Enter, odošle sa požiadavka na vzdialený server. V tomto scenári môžeme hovoriť o API. Napríklad pri vyhľadávaní na stránke google.com sa z nášho zariadenia odošle požiadavka na server Googlu. Táto požiadavka má podobu textového dokumentu.

## Štruktúra požiadavky (Request)

Požiadavka obsahuje tri hlavné časti. Prvou časťou je **HTTP verb**, ktorý určuje, akú akciu má server vykonať. Druhou časťou sú **hlavičky (headers)**, ktoré nesú informácie o samotnej požiadavke. Treťou časťou je **obsah (content)**, ktorý je voliteľný a obsahuje dáta posielané serveru.

Ak chceme na serveri niečo vytvoriť, použijeme HTTP verb **POST**. V hlavičkách sa môžu nachádzať informácie, ako napríklad dĺžka obsahu. Samotný obsah potom obsahuje dáta, ktoré chceme vytvoriť, napríklad textový reťazec „magic API“. Všetky tieto informácie sú súčasťou jedného textového dokumentu, ktorý server prijme.

## Spracovanie požiadavky serverom

Keď server dostane požiadavku, buď ju dokáže spracovať, alebo ju odmietne, ak nie je platná. V oboch prípadoch však server vždy pošle späť odpoveď klientovi.

## Štruktúra odpovede (Response)

Odpoveď servera je taktiež dátový objekt, ktorý si môžeme predstaviť ako ďalší textový dokument. Obsahuje tri časti, ktorými sú **stavový kód (status code)**, **hlavičky (headers)** a **obsah (content)**. Stavový kód informuje klienta o tom, ako požiadavka dopadla, teda či bola úspešná alebo zlyhala.

V prípade POST požiadavky môže server vrátiť stavový kód **201 Created**, ktorý znamená, že požadovaný zdroj bol úspešne vytvorený. Spolu s tým môže server poslať späť aj dáta, napríklad text „magic API“, a v hlavičkách uviesť typ obsahu, napríklad text.

## Bezstavovosť servera (Stateless)

Dôležitým konceptom je, že server je **bezstavový (stateless)**. To znamená, že server si nepamätá predchádzajúce požiadavky. Po spracovaní požiadavky a odoslaní odpovede na ňu zabudne. Ak by si server pamätal všetky požiadavky, viedlo by to k extrémnej spotrebe pamäte a zahlteniu úložiska.

## Request objekt v API

```
Request Object
├── HTTP Verb (Action)
│   ├── GET – získanie dát
│   ├── POST – vytvorenie nového zdroja
│   ├── PUT – aktualizácia celého zdroja
│   ├── PATCH – čiastočná aktualizácia zdroja
│   └── DELETE – odstránenie zdroja
├── Headers (Metadata)
│   ├── Content-Type
│   ├── Content-Length
│   ├── Authorization
│   ├── Accept
│   └── Custom Headers
└── Content / Body (Optional)
    ├── JSON objekt
    ├── XML
    ├── Binárne dáta
    └── Žiadny obsah (pri GET)

```

### HTTP verb (akcia)

Prvou časťou request objektu je **HTTP verb**, ktorý sa označuje aj ako akcia. HTTP verb určuje, akú operáciu má server vykonať. Pri práci s dátami zvyčajne potrebujeme dáta vytvárať, čítať, aktualizovať alebo mazať, a práve na to slúžia jednotlivé HTTP metódy.

Najčastejšie používaným HTTP verbom je **GET**, ktorý sa používa vtedy, keď chceme zo servera získať nejaký zdroj alebo webovú stránku. Inými slovami, GET znamená „pošli mi dáta zo servera“.

Ďalším často používaným verbom je **POST**, ktorý sa používa na vytvorenie alebo vloženie nového zdroja. Ak chceme na server pridať nový záznam alebo objekt, použijeme POST požiadavku.

Na aktualizáciu existujúceho zdroja slúži **PUT**. Tento verb sa používa vtedy, keď chceme nahradiť celý existujúci objekt novými dátami.

V niektorých prípadoch sa používa aj **PATCH**, ktorý slúži na čiastočnú aktualizáciu zdroja. Ak má objekt napríklad sto vlastností a chceme zmeniť iba jednu z nich, použijeme PATCH. Rozdiel medzi PUT a PATCH je v tom, že PUT posiela celý objekt, zatiaľ čo PATCH mení len jeho časť.

Posledným z najčastejšie používaných verbov je **DELETE**, ktorý slúži na odstránenie zdroja zo servera. Okrem týchto metód existujú aj ďalšie HTTP verbá, no v praxi sa používajú len zriedka a najčastejšie sa pracuje práve s týmito piatimi.

### Hlavičky (Headers)

Ďalšou časťou request objektu sú **hlavičky (headers)**. Hlavičky predstavujú sadu párov názov–hodnota a obsahujú metadáta o požiadavke. Jednou z najdôležitejších hlavičiek je **Content-Type**, ktorá určuje typ obsahu v požiadavke, napríklad či ide o binárne dáta, JSON, XML alebo obyčajný text.

Hlavička **Content-Length** určuje veľkosť obsahu, ktorý sa nachádza v tele požiadavky. V niektorých prípadoch je potrebná aj autentifikácia, a vtedy sa používa hlavička **Authorization**, ktorá môže obsahovať napríklad bearer token alebo iný autentifikačný údaj.

Ďalšou hlavičkou môže byť informácia o tom, aký typ odpovede je akceptovateľný, napríklad JSON alebo XML. Okrem týchto základných hlavičiek existujú stovky ďalších a vývojár si môže definovať aj vlastné hlavičky, ak sú v danej situácii užitočné. Vo všeobecnosti však platí, že hlavičky obsahujú metadáta o požiadavke a jej obsahu.

### Obsah (Body / Content)

Poslednou časťou request objektu je **obsah (content alebo body)**, ktorý je voliteľný. Do obsahu sa vkladajú dáta, ktoré server potrebuje na spracovanie požiadavky. Najčastejšie ide o JSON objekt, ktorý server následne deserializuje a použije pri spracovaní požiadavky. Obsah môže byť aj binárny súbor alebo iný typ dát, ktoré sa majú vytvoriť alebo aktualizovať.

Pri použití HTTP verbu **GET** sa obsah neposiela, pretože klient iba žiada server o vrátenie dát a server neočakáva žiadne vstupné údaje. Naopak, pri požiadavkách typu POST, PUT alebo PATCH je obsah veľmi dôležitý, pretože obsahuje objekt, ktorý sa má vytvoriť alebo aktualizovať. Server si tento objekt z obsahu vyberie a na jeho základe vykoná požadovanú operáciu.

## Response objekt v API

**Response objekt** je objekt, ktorý server alebo API vracia späť klientovi po spracovaní požiadavky. Nezáleží na tom, či bola požiadavka úspešná alebo zlyhala, server vždy odošle odpoveď.

```
Response Object
├── Status Code (Result)
│   ├── 1xx – Informational
│   ├── 2xx – Success
│   │   ├── 200 OK – Request successful
│   │   ├── 201 Created – Resource created
│   │   └── 204 No Content – Success, no content returned
│   ├── 3xx – Redirection
│   ├── 4xx – Client Error
│   │   ├── 400 Bad Request – Invalid request
│   │   └── 404 Not Found – Resource does not exist
│   └── 5xx – Server Error
│       └── 500 Internal Server Error – Server failed to process request
├── Headers (Metadata)
│   ├── Content-Type
│   ├── Content-Length
│   ├── Cache / Expiry info
│   └── Custom Headers
└── Content / Body
    ├── JSON
    ├── HTML
    ├── Blobs / Binary data
    └── Empty (e.g., 204 No Content)

```

### Stavový kód (Status Code)

Prvou a najdôležitejšou súčasťou response objektu je **stavový kód**. Stavový kód je číselná hodnota, ktorá informuje klienta o výsledku spracovania požiadavky na serveri. Tieto kódy sú rozdelené do určitých číselných rozsahov, pričom každý rozsah má svoj význam.

Stavové kódy v rozsahu **100 až 199** slúžia na informačné účely. Tieto kódy existujú, no v praxi sa s nimi stretávame len veľmi zriedkavo.

Najčastejšie používané sú stavové kódy v rozsahu **200 až 299**, ktoré označujú úspešné spracovanie požiadavky. Najznámejší je stavový kód **200 OK**, ktorý znamená, že požiadavka bola úspešne spracovaná a všetko prebehlo podľa očakávania. Stavový kód **201 Created** sa používa najmä pri POST požiadavkách a informuje klienta, že nový zdroj bol úspešne vytvorený na serveri. Ďalším dôležitým kódom je **204 No Content**, ktorý sa často používa pri aktualizáciách, keď chceme potvrdiť úspech operácie, ale nechceme vracať žiadne dáta. Aj napriek tomu, že odpoveď neobsahuje žiadny obsah, stále ide o úspešnú operáciu.

Rozsah stavových kódov **300 až 399** sa používa v prípadoch, keď dochádza k presmerovaniu požiadavky na inú adresu.

Stavové kódy v rozsahu **400 až 499** predstavujú chyby na strane klienta. Znamená to, že požiadavka bola nesprávna alebo neúplná. Typickým príkladom je stavový kód **404 Not Found**, ktorý znamená, že požadovaný zdroj neexistuje. Môže k tomu dôjsť napríklad vtedy, ak klient požiada o zdroj s ID, ktoré sa na serveri nenachádza. Ďalším častým kódom je **400 Bad Request**, ktorý signalizuje, že požiadavka nebola správne zostavená alebo nespĺňala očakávania servera.

Posledným rozsahom sú stavové kódy **500 až 599**, ktoré označujú chyby na strane servera. Najznámejší z nich je **500 Internal Server Error**, ktorý znamená, že server narazil na internú chybu počas spracovania požiadavky. V tomto prípade bola požiadavka zo strany klienta správna, ale server ju nedokázal úspešne spracovať, napríklad kvôli internej výnimke alebo chybe v aplikácii.

Stavové kódy zohrávajú veľmi dôležitú úlohu, pretože na ich základe klient dokáže rozpoznať, či bola požiadavka úspešná, či zlyhala a aký bol dôvod zlyhania.

### Hlavičky v response objekte

Response objekt obsahuje aj **hlavičky**, ktoré podobne ako pri requeste nesú metadáta. Tentokrát však ide o metadáta týkajúce sa odpovede, ako napríklad typ obsahu, veľkosť odpovede, alebo informáciu o tom, dokedy je odpoveď platná. Hlavičky v response objekte poskytujú klientovi dôležité technické informácie o vrátených dátach.

### Obsah odpovede (Response Content)

Súčasťou response objektu je aj **obsah**, ktorý môže obsahovať rôzne typy dát. Môže ísť o JSON výsledok, binárne dáta, HTML stránku alebo akýkoľvek iný obsah, ktorý server potrebuje klientovi odoslať. Obsah závisí od typu požiadavky a od toho, čo klient od servera očakáva.

### Porovnanie request a response

Request aj response objekt obsahujú hlavičky a obsah. Hlavný rozdiel medzi nimi spočíva v tom, že request obsahuje **HTTP verb**, ktorý určuje, aká akcia sa má vykonať, zatiaľ čo response obsahuje **stavový kód**, ktorý informuje o výsledku tejto akcie. Hlavičky v oboch prípadoch slúžia na prenos metadát a obsah nesie samotné dáta.

## Tvorba API endpointov v .NET

Po pridaní controlleru do projektu je potrebné definovať endpoints prostredníctvom action metód v rámci kontroléra.

Príklad action metódy, ktorá vracia typ `string`, môže byť metóda s názvom `GetVillas`, ktorá vráti reťazec "get all villas". Takáto metóda predstavuje endpoint kontroléra.

```cs
using Microsoft.AspNetCore.Mvc;

namespace WebApplication1.Controllers
{
    [ApiController]
    public class VillaController : ControllerBase
    {
        [HttpGet]
        [Route("Villas")]
        public string GetVillas()
        {
            return "List of Villas";
        }
    }
}
```

### Pridanie atribútov pre API controller

Endpoint bez atribútov nie je kompatibilný s API controllerom. Pri spustení aplikácie sa zobrazí chybové hlásenie:

> "Action methods on controller annotated with API controller attribute must be attribute routed."

Pre správnu funkčnosť je potrebné pridať atribút `[Route("Villas")]` k endpointu, čím sa definuje cesta požiadavky.

Endpoint sa nezobrazí v dokumentácii Swagger, pokiaľ nie je určený typ HTTP požiadavky (`GET`, `POST`, `PUT`, `DELETE`). Pre GET požiadavku sa pridáva atribút `[HttpGet]`.

### Definovanie route na controlleri

Route je možné definovať aj na úrovni kontroléra, napríklad `[Route("api/villa")]` pre VillaController. Všetky endpointy kontroléra budú dostupné pod touto základnou URL.

Definovanie route na úrovni kontroléra umožňuje organizovať endpointy podľa funkčnosti. Každá entita, napríklad VillaCategory alebo Amenities, môže mať vlastný controller.

VillaController je zodpovedný za operácie súvisiace s entitou vila.

```cs
using Microsoft.AspNetCore.Mvc;

namespace WebApplication1.Controllers
{
    // [Route("api/[controller]")]
    [Route("api/Villa")]
    [ApiController]
    public class VillaController : ControllerBase
    {
        [HttpGet]
        public string GetVillas()
        {
            return "List of Villas";
        }
    }
}
```

### Odporúčané postupy pri definovaní route

- Route by mala byť statická, nie dynamická (`[controller]`), aby sa predišlo zmenám URL pri zmene názvu kontroléra.
- Route na úrovni akcie (endpointu) má prednosť pred route na úrovni kontroléra.
- Pri viacerých GET endpointoch je potrebné zabezpečiť jednoznačné URL, aby sa predišlo konfliktom v definícii API.

---

#### Zhrnutie

1. Každý endpoint musí byť attribute routed a musí mať definovaný HTTP verb.
2. Endpointy pre jednu entitu majú byť v jej controlleri podľa REST protokolov.
3. Route môže byť definovaná na úrovni controller alebo action, pričom action route má prednosť.
4. Odporúča sa používať statické názvy route, aby sa predišlo problémom pri zmene názvu kontroléra.
5. Swagger UI alebo iný nástroj umožňuje testovať endpointy a kontrolovať ich response a status kód.

Týmto spôsobom je možné pridávať GET, POST, PUT alebo DELETE endpointy a udržiavať API prehľadné a organizované.

### Získanie jednej entity a viazanie parametrov (Parameter Binding)

Pri CRUD operáciách je bežná požiadavka získať **jednu konkrétnu entitu podľa ID**. Okrem endpointu na získanie všetkých víl je preto potrebné vytvoriť aj **GET endpoint pre jednu vilu**.

---

### GET endpoint s route parametrom (Get by ID)

Ak existujú dva GET endpointy v tom istom controlleri, je potrebné ich **jednoznačne odlíšiť pomocou route parametrov**. Inak bude controller nevedieť, ktorý endpoint má spracovať, a Swagger zobrazí iba jeden z nich.

Riešením je použiť **route parameter binding**:

- Do atribútu `[HttpGet]` sa pridá route šablóna, napr. `"{id:int}"`
- Hodnota `id` sa extrahuje z URL, automaticky konvertuje na `int` a odovzdá do metódy

Výsledok:

- `GET /api/Villa` → zavolá sa endpoint na získanie všetkých víl
- `GET /api/Villa/3` → zavolá sa endpoint na získanie vily s ID = 3

Swagger (OpenAPI) vďaka tomu správne zobrazí **oba endpointy**.

---

### Viac route parametrov

Route môže obsahovať **viac parametrov**, napríklad ID a názov.

Príklad štruktúry URL:

- `/api/Villa/3/RoyalRoom`

Poznámky:

- Typ `string` sa **neuvádza v route constraint**, je predvolený
- Typy ako `int`, `bool` a pod. je potrebné uviesť explicitne

---

### Explicitné určenie zdroja dát

Parametre sa štandardne viažu z route automaticky, ale je možné byť explicitný:

- `[FromRoute]` – hodnota sa berie z URL cesty
- `[FromQuery]` – hodnota sa berie z query stringu
- `[FromHeader]` – hodnota sa berie z HTTP hlavičky

Explicitné určenie **nie je povinné**, ale zvyšuje čitateľnosť a jednoznačnosť kódu.

---

### Query parameter binding

Ak sa použije `[FromQuery]`:

- Route neobsahuje parametre
- Hodnoty sa posielajú za `?` v URL

Príklad:

- `GET /api/Villa?id=10&name=Test`

V Swaggeri sa tieto hodnoty zobrazia v sekcii **Query parameters**.

**Pozor:**  
Ak majú dva GET endpointy rovnakú route a líšia sa len query parametrami, vznikne **konflikt** – preto je potrebné mať jednoznačné route definície.

---

### Header parameter binding

Parameter je možné získať aj z HTTP hlavičky pomocou `[FromHeader]`.

Príklad správania:

- `id` je z query (`[FromQuery]`)
- `name` je z hlavičky (`[FromHeader]`)

Swagger automaticky:

- zobrazí `id` v query parametroch
- pridá `name` do sekcie **Request Headers**

---

### Prehľad spôsobov získania dát

Aktuálne prebrané možnosti viazania parametrov:

1. **Route** – hodnota je súčasťou URL cesty
2. **Query** – hodnota je v query stringu (`?key=value`)
3. **Header** – hodnota je v HTTP hlavičke

Ďalšie možnosti, ktoré budú prebrané neskôr:

- `[FromBody]`
- `[FromForm]`

---

### Zhrnutie

- Pri viacerých GET endpointoch je nutné používať **route parametre**, aby sa predišlo konfliktom
- Route parameter binding umožňuje jednoznačne rozlíšiť endpointy
- Parametre je možné získavať z **route, query alebo header**
- Swagger správne zobrazí endpointy aj parametre len vtedy, ak je API jednoznačne definované

## Integrácia databázy SQL Server pomocou Entity Framework Core

Momentálne máme v aplikácii dva **GET endpointy**, no pri práci s API budeme potrebovať plnohodnotnú podporu **CRUD operácií** (Create, Read, Update, Delete).  
Na to je nevyhnutné prepojiť aplikáciu s databázou, z ktorej budeme čítať a do ktorej budeme zapisovať dáta.

Na integráciu databázy použijeme **SQL Server** spolu s **Entity Framework Core (EF Core)**.

---

## Konfigurácia databázy a connection stringu

Najskôr je potrebné vytvoriť databázu v **SQL Serveri** (lokálna inštancia).

Následne sa v aplikácii nastaví **connection string** v súbore `appsettings.json`.

Postup:

1. Otvoriť **Application Settings**
2. Pridať sekciu **ConnectionStrings**
3. Vytvoriť nový connection string s názvom napríklad `DefaultConnection`

Príklad vlastností connection stringu:

- názov servera (podľa lokálneho SQL Servera)
- názov databázy (napr. `RoyalVilla`)
- `Trusted_Connection=True`
  - Používa Windows autentifikáciu namiesto SQL Server prihlasovacích údajov (login/heslo).
- `TrustServerCertificate=True`
  - Keď je nastavené na True, klient dôveruje certifikátu servera bez ohľadu na certifikačnú autoritu – používa sa najmä pri vývoji alebo na lokálnych serveroch.

---

## Inštalácia NuGet balíkov pre Entity Framework Core

Pre prácu s EF Core je potrebné nainštalovať nasledujúce balíky:

1. **Microsoft.EntityFrameworkCore.SqlServer**
   - automaticky nainštaluje aj základný Entity Framework Core

2. **Microsoft.EntityFrameworkCore.Tools**
   - umožňuje pracovať s migráciami (`Add-Migration`, `Update-Database`)

Odporúča sa použiť **najnovšiu verziu** oboch balíkov.

---

## Vytvorenie ApplicationDbContext

Po nainštalovaní balíkov je potrebné vytvoriť **DbContext**.

Postup:

1. V projekte vytvoriť priečinok `Data`
2. Pridať triedu `ApplicationDbContext`
3. Trieda bude dediť z `DbContext` (`Microsoft.EntityFrameworkCore`)

### Konštruktor DbContextu

`ApplicationDbContext` musí obsahovať konštruktor, ktorý prijíma `DbContextOptions` a posúva ich do base triedy.

Ide o **štandardnú a odporúčanú konfiguráciu** pre EF Core v .NET API aj MVC aplikáciách.

---

## Registrácia DbContextu v Program.cs

Aby aplikácia vedela používať databázu, je potrebné zaregistrovať DbContext v `Program.cs`.

Postup:

- Použiť `builder.Services.AddDbContext<ApplicationDbContext>()`
- Nastaviť použitie SQL Servera pomocou `UseSqlServer`
- Načítať connection string z `appsettings.json` pomocou:
  - `builder.Configuration.GetConnectionString("DefaultConnection")`

Connection stringy sa štandardne ukladajú do `appsettings.json`, prípadne neskôr do KeyVaultu alebo iného bezpečného úložiska.

---

## Migrácie a vytvorenie databázy

Keďže zatiaľ nemáme žiadne modely:

- prvá migrácia bude **prázdna**
- databáza sa však aj tak vytvorí

Postup:

1. Otvoriť **Package Manager Console**
2. Spustiť príkaz:
   - `Add-Migration InitialMigration`
3. Spustiť:
   - `Update-Database`

Výsledok:

- v SQL Serveri sa vytvorí databáza `RoyalVilla`
- vznikne tabuľka `__EFMigrationsHistory`, ktorá sleduje aplikované migrácie

---

## Vytvorenie modelu a tabuľky (Villa)

Na vykonávanie CRUD operácií potrebujeme **model**, z ktorého EF Core vytvorí tabuľku.

Postup:

1. Vytvoriť priečinok `Models`
2. Pridať triedu `Villa`

### Príklad vlastností modelu Villa:

- `Id` (int, primárny kľúč)
- `Name` (required)
- `Details` (nullable)
- `Rate`
- `SquareFeet`
- `ImageUrl`
- `CreatedDate`
- `UpdatedDate` (nullable)

> EF Core automaticky rozpozná `Id` ako primárny kľúč.

---

## Prepojenie modelu s DbContextom

V `ApplicationDbContext` je potrebné pridať `DbSet`:

- `DbSet<Villa> Villas`

Názov `Villas` bude názvom tabuľky v databáze.

---

## Migrácia pre vytvorenie tabuľky Villa

Po pridaní modelu a DbSetu:

1. Spustiť:
   - `Add-Migration AddVillaToDb`
2. Spustiť:
   - `Update-Database`

Výsledok:

- EF Core vytvorí tabuľku **Villa**
- stĺpce budú zodpovedať vlastnostiam modelu

---

## Seedovanie dát do databázy

Aby sme mali s čím pracovať v API, databázu naplníme **testovacími dátami**.

Seedovanie sa vykoná:

- priamo v `ApplicationDbContext`
- pomocou metódy `OnModelCreating`
- s použitím `HasData()`

Do databázy sa vloží napríklad **5 záznamov vily**.

```cs
protected override void OnModelCreating(ModelBuilder modelBuilder)
{
    base.OnModelCreating(modelBuilder);

    modelBuilder.Entity<Villa>().HasData(
        new Villa
        {
            Id = 1,
            Name = "Royal Villa",
            Details = "Luxurious villa with stunning ocean views and private beach access.",
            Rate = 500.0,
            Sqft = 2500,
            Occupancy = 6,
            ImageUrl = "https://dotnetmasteryimages.blob.core.windows.net/bluevillaimages/villa1.jpg",
            CreatedDate = new DateTime(2024, 1, 1),
            UpdatedDate = new DateTime(2024, 1, 1)
        }
    );
}
```

## Automatické aplikovanie migrácií pri štarte aplikácie

Aby nebolo nutné manuálne spúšťať `Update-Database`, je možné nastaviť **automatické aplikovanie migrácií**.

Postup:

1. V `Program.cs` vytvoriť statickú metódu (napr. `SeedDataAsync`)
2. Vytvoriť scope zo `IServiceProvider`
3. Získať `ApplicationDbContext`
4. Zavolať `Database.MigrateAsync()`
5. Metódu zavolať po `builder.Build()`

```cs
var app = builder.Build();

// Zavolá metódu na automatické aplikovanie migrácií po spustení aplikácie
await SeedDataAsync(app);

// Statická asynchrónna metóda na aplikovanie migrácií
static async Task SeedDataAsync(WebApplication app)
{
    // Vytvorí scope pre získanie služieb (dependency injection)
    using var scope = app.Services.CreateScope();
    // Získa inštanciu ApplicationDbContext z DI kontajnera
    var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    // Aplikuje všetky čakajúce migrácie do databázy
    await dbContext.Database.MigrateAsync();
}
```

Táto logika:

- **nepridáva migrácie**
- iba aplikuje tie, ktoré ešte neboli aplikované

---

## Seed migrácia

Keďže sme pridali seed dáta:

1. Spustiť:
   - `Add-Migration SeedVilla`
2. Nie je potrebné spúšťať `Update-Database`
3. Stačí spustiť aplikáciu

Výsledok:

- migrácie sa aplikujú automaticky

---

## Výsledok

- SQL Server databáza je prepojená s API
- Entity Framework Core je nakonfigurovaný
- Databáza obsahuje tabuľku Villa s dátami
- Aplikácia je pripravená na **CRUD operácie cez API endpointy**
