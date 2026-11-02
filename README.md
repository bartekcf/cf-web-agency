# TwojaStrona — strony WWW dla małych firm

Statyczna strona sprzedażowa zbudowana w Astro, TypeScript i Tailwind CSS v4. Zawiera pakiety, demonstracyjne koncepcje portfolio, opis współpracy, FAQ i formularz zapytania. Nazwa marki jest tymczasowa.

## Uruchomienie

Wymagany Node.js zgodny z `package.json` i pnpm.

```sh
pnpm install
pnpm dev
```

Sprawdzenie typów i produkcyjnego builda:

```sh
pnpm astro check
pnpm build
pnpm preview
```

## Konfiguracja przed wdrożeniem

1. Uzupełnij `src/data/site.ts`: nazwę firmy, publiczny adres strony oraz kontaktowy adres e-mail i telefon (jeśli będą używane). `PUBLIC_SITE_URL` może ustawić adres kanoniczny podczas builda; bez niego canonicale nie są emitowane, sitemap nie zawiera adresów, a `robots.txt` nie wskazuje mapy strony.
2. Ustaw `PUBLIC_SITE_URL=https://twoja-domena.pl` w środowisku produkcyjnego builda. To publiczna konfiguracja adresu serwisu, nie sekret. Wartość musi być adresem produkcyjnym z protokołem HTTPS.
3. Formularz nie wysyła danych, dopóki nie ustawisz `PUBLIC_FORM_ENDPOINT` na endpoint zewnętrznej usługi obsługującej żądania `POST` z `FormData` i zwracającej sukces statusem HTTP 2xx. Przykład konfiguracji środowiska: `PUBLIC_FORM_ENDPOINT=https://...`. Endpoint musi być przeznaczony do publicznych formularzy i akceptować żądania cross-origin z domeny strony. Bez konfiguracji formularz waliduje pola, ale wyświetla jasny komunikat, że dane nie zostały wysłane.
4. Zastąp koncepcyjne dane w `src/data/projects.ts` prawdziwymi realizacjami dopiero po uzyskaniu zgody na ich publikację. Obecne projekty są wyraźnie oznaczone jako demonstracyjne.
5. Uzupełnij i zatwierdź treści `/polityka-prywatnosci/` i `/regulamin/` zgodnie z faktyczną działalnością, dostawcami i obowiązkami prawnymi. Obecne strony są roboczym szkieletem, celowo oznaczonym do uzupełnienia i wyłączonym z indeksowania.
6. Zweryfikuj ceny i zakresy pakietów w `src/data/packages.ts`; obecne kwoty to wstępna konfiguracja biznesowa.

Nie skonfigurowano analityki ani integracji płatności. Formularz nie przyjmuje załączników i nie tworzy zamówienia ani umowy.

## Struktura

- `src/data/` — centralna konfiguracja marki, pakiety, projekty demonstracyjne, usługi dodatkowe i FAQ.
- `src/components/` — wspólne elementy layoutu, karty ofert i projektów, formularz.
- `src/pages/` — strona główna, oferta i szczegóły pakietów, portfolio i szczegóły projektów, proces, kontakt, dokumenty, 404, sitemap i robots.
- `src/styles/global.css` — tokeny kolorystyczne, typografia, komponenty i responsywne style.
