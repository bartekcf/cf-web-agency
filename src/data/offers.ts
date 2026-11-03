export const offers = [
  {
    slug: 'strona-dla-firmy',
    name: 'Strona dla firmy',
    priceLabel: 'Cena po ustaleniu zakresu',
    summary: 'Przejrzysta prezentacja firmy, jej usług, realizacji i sposobu kontaktu.',
    audience: 'Dla małej firmy, która chce pokazać swoją ofertę i ułatwić klientom pierwszy kontakt.',
    result: 'Klient szybko sprawdzi, czym zajmuje się firma i jak się z nią skontaktować.',
    scope: [
      'Prezentacja firmy, usług, realizacji i kontaktu',
      'Pomoc w zebraniu i uporządkowaniu treści',
      'Projekt dopasowany do telefonów i komputerów',
      'Pomoc z domeną, hostingiem i publikacją w uzgodnionym zakresie',
    ],
  },
  {
    slug: 'prosta-aplikacja',
    name: 'Prosta aplikacja dla firmy',
    priceLabel: 'Cena po ustaleniu zakresu',
    summary: 'Proste narzędzie do obsługi jasno opisanego procesu w Twojej firmie.',
    audience: 'Dla firmy, która chce uporządkować powtarzalne zadanie, zgłoszenia, zlecenia lub dane.',
    result: 'Ustalimy, co narzędzie ma ułatwić, i zaproponujemy zakres przed rozpoczęciem prac.',
    scope: [
      'Rozmowa o procesie i problemie do rozwiązania',
      'Ustalenie potrzebnych informacji i kolejnych kroków',
      'Propozycja funkcji, zakresu i ceny przed realizacją',
      'Wykonanie, sprawdzenie i uruchomienie uzgodnionego rozwiązania',
    ],
  },
] as const;
