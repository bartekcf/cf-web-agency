# TwojaStrona — strony i proste aplikacje dla małych firm

Statyczny serwis w Astro, TypeScript i Tailwind CSS v4. Zawiera stronę główną, dwie oferty, strony szczegółowe, koncepcyjne dema portfolio, opis współpracy, FAQ i krótki formularz prośby o telefon. Wysyłkę obsługuje Cloudflare Worker z Email Sending bindingiem. Nazwa marki jest tymczasowa.

## Uruchomienie

Wymagany Node.js zgodny z `package.json` i pnpm.

```sh
pnpm install
pnpm dev
```

`pnpm dev` uruchamia podgląd Astro. Endpoint `/api/callback` działa w Workerze, dlatego do sprawdzenia całego formularza użyj:

```sh
pnpm run dev:worker
```

Ten skrypt buduje statyczne strony i uruchamia lokalny Wrangler. Lokalny Email Sending binding symuluje dostarczenie i zapisuje treść do logu/pliku — nie wysyła wiadomości na zewnątrz. Formularz przy pustym adresie odbiorcy lub nadawcy zwraca błąd, nie komunikat o sukcesie.

Sprawdzenia i wdrożenie:

```sh
pnpm astro check
pnpm build
pnpm preview
pnpm run deploy:cloudflare
```

`pnpm preview` podgląda samą statyczną stronę. `pnpm run deploy:cloudflare` buduje ją i wdraża Worker oraz assety przez Wrangler.

## Konfiguracja przed wdrożeniem

1. `src/data/site.ts` — ustaw docelową nazwę marki. `PUBLIC_SITE_URL` podaj w środowisku produkcyjnego builda jako pełny adres HTTPS. Bez niego canonicale i adresy w sitemapie nie będą wskazywać domeny produkcyjnej.
2. `src/data/contact.ts` — uzupełnij rzeczywisty numer telefonu (`phone`), adres kontaktowy i odbiorczy (`email`) oraz zweryfikowany adres nadawcy (`emailFrom`). Te wartości są obecnie puste. Numer i e-mail są wyświetlane tylko po skonfigurowaniu.
3. W Cloudflare skonfiguruj Email Sending: dodaj i zweryfikuj domenę nadawcy oraz zweryfikuj adres odbiorcy. Worker używa bindingu `MAILER`; nie przechowuje klucza SMTP ani sekretu w przeglądarce. Bez poprawnej konfiguracji formularz zwraca błąd i zachowuje wpisane dane. Nie włączaj zdalnego bindingu podczas lokalnych testów, bo wtedy wysyłka byłaby rzeczywista.
4. `src/data/offers.ts` — znajdują się tu dwa robocze kierunki: „Strona dla firmy” i „Prosta aplikacja dla firmy”. Nie ma zatwierdzonych cen, statusu netto/brutto, limitów zakresu ani stawek utrzymania. Strona pokazuje „Cena po ustaleniu zakresu”; potwierdź nazwy i zakresy przed publikacją.
5. `src/data/projects.ts` — obecne projekty są koncepcjami demonstracyjnymi, nie referencjami. Zastąp je prawdziwymi realizacjami dopiero po uzyskaniu zgody na publikację.
6. Uzupełnij dane administratora i usługodawcy oraz zatwierdź `/polityka-prywatnosci/` i `/regulamin/` przed produkcyjnym uruchomieniem. Obecne dokumenty są szkieletem, mają `noindex` i nie stanowią gotowej treści prawnej.
7. `wrangler.jsonc` definiuje statyczne assety, endpoint formularza, Email Sending i limit 5 zgłoszeń na 60 sekund z jednego adresu IP. Ograniczenie Cloudflare jest przybliżone i liczone osobno w lokalizacjach edge; współdzielone IP może obejmować kilku użytkowników. `namespace_id` limitera musi być unikalny na koncie Cloudflare — przed wdrożeniem zmień `824731905`, jeśli jest już używany.

Brakuje także produkcyjnej domeny, numeru telefonu, adresu odbiorczego i nadawczego, zatwierdzonego cennika oraz warunków utrzymania. Nie skonfigurowano analityki ani płatności. Formularz zbiera tylko numer telefonu i wymagane potwierdzenie zapoznania się z informacją o prywatności; imię, wybór oferty i wiadomość są opcjonalne. Nie tworzy zamówienia ani umowy.

## Struktura

- `src/data/` — centralna konfiguracja marki, kontaktu, ofert, projektów demonstracyjnych i FAQ.
- `src/components/` — wspólne elementy layoutu, karty ofert i projektów oraz formularz.
- `src/pages/` — strona główna, oferta i jej szczegóły, portfolio, proces, kontakt, dokumenty, 404, sitemap i robots.
- `src/worker.ts` — walidacja i ochrona formularza oraz przekazanie zgłoszenia do Email Sending bindingu.
- `pnpm-workspace.yaml` — jawnie dopuszcza skrypty wymagane przez `esbuild` i `workerd` w Astro/Wrangler.
- `src/styles/global.css` — tokeny kolorystyczne, typografia, komponenty i responsywne style.
