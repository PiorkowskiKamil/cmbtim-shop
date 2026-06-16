# cmbtim-shop — kickoff (demo sklepu materiałów budowlanych w stylu CMB TIM)

## Założenia / otwarte (gate — czytaj zanim ruszysz)
- `ASSUMED` Lokalny prototyp/demo — płatności **mockowane**, bez realnej bramki. Wygląd + przepływ najpierw.
- `RISK` Późniejsza integracja z cmbtim.pl (Joomla) — mechanizm nieznany. Odwracalność kupiona: dane za **`getProducts()`** (dziś JSON → jutro fetch z ich API), apka **standalone**. Decyzja o mechanizmie = last responsible moment.
- `ASSUMED` Treści NIE są edytowalne dla klienta w demo (w kodzie/JSON) — świadoma decyzja 2026-06-17. CMS (Decap/Tina git-based albo Sanity hosted) lub panel Joomla podepniemy przez **`getProducts()`** seam gdy zapadnie kierunek integracji. Nie budować spekulatywnie.
- `ASSUMED` Branża = materiały budowlane (jak CMB TIM); kategorie i nazwy z ich realnego katalogu.

## Tożsamość wizualna (wyciągnięta z CSS cmbtim.pl, nie zgadnięta)
- Akcent / złoto: **`#C7A024`** (`rgba(199,160,36)` ×247)
- Stalowy niebieski: **`#4A6485`** · Granat (overlay/głębia): **`#061E3E`**
- Tekst/grafit: **`#212121`** / `#3C4148` · Tła: `#FFFFFF` / `#F5F5F5`
- Font: **Poppins** (semibold nagłówki, regular tekst)
- Layout: siatka kafli kategorii (8: Elewacje, Dekarskie, Remonty, Farby przemysłowe, Elektryczne, Hydrauliczne, Narzędzia, BHP)

## Stack (Oś 2 — two-way doory, default; one-way: model danych + granica integracji)
Vite + React + TS + Tailwind · runtime/pm **bun** · dane = typowany moduł za `getProducts()` · koszyk `localStorage` · checkout mock · projekt `~/Projects/Personal/cmbtim-shop`.

## Zespół (Oś 3 — 1 piszący + 4 read-only po buildzie)
- **Builder** (główny wątek) — jedyny piszący
- **Data harvester** (read-only) — leci pierwszy, zasysa katalog cmbtim → JSON
- **da-reviewer** — poprawność: spec + diff (świeży kontekst) → SHIP / SHIP_WITH_FIXES / BLOCK
- **gan-evaluator** — UI: żywa apka via Playwright, rubryka wyglądu
- **e2e-runner** — E2E przepływ + artefakty

## Skille (Oś 4 — ultra-trim)
`vite-patterns` · `frontend-patterns` · `design-system` · `data-scraper-agent` · `e2e-testing` · `browser-qa` · `ponytail:ponytail`(ultra)
Wycięte (add gdy zaboli): web-typography, bun-runtime, web-imagery, web-project-orchestration, agent-sort, web-color-palette.

## Done — kryteria EARS (Oś 5)
- **F1 Katalog**
  - WHEN user otwiera stronę główną → system SHALL pokazać 8 kafli kategorii. *(gan-evaluator)*
  - WHEN user klika kategorię → system SHALL wyświetlić produkty tej kategorii z `getProducts()`. *(e2e-runner)*
  - WHEN user klika produkt → system SHALL pokazać kartę (nazwa, kategoria, cena, opis, zdjęcie/placeholder). *(e2e-runner)*
- **F2 Koszyk + checkout (mock)**
  - WHEN user klika „Do koszyka" → system SHALL dodać pozycję i zaktualizować licznik (`localStorage`). *(e2e-runner)*
  - WHEN user otwiera koszyk → system SHALL pokazać pozycje + sumę. *(e2e-runner)*
  - WHEN user zatwierdza checkout → system SHALL pokazać ekran „Zamówienie złożone" (bez realnej płatności). *(e2e-runner)*
- **F3 Szukajka**
  - WHEN user wpisuje frazę → system SHALL pokazać produkty z frazą w nazwie (case-insensitive); brak trafień → „brak wyników". *(e2e-runner)*
- **E1 Wygląd „jak CMB TIM"** (rubryka gan-evaluator, każdy punkt pass/fail)
  - `#C7A024` faktycznie użyte na akcentach (przyciski/aktywne) · Poppins renderowany w nagłówkach · siatka kafli kategorii · tła `#FFFFFF`/`#F5F5F5`, tekst `#212121`.
- **Globalne (correctness + live)**
  - da-reviewer na diffie ≠ BLOCK · `bun run dev` startuje bez błędów konsoli · screenshot żywej apki + side-by-side vs cmbtim.

## Build — kolejność (checkbox) — ZBUDOWANE 2026-06-17
- [x] E3 — scaffold Vite 8 + React 19 + TS + Tailwind v4 (bun); dev na :5174
- [x] E1 — design-system: tokeny #C7A024/#061E3E/#4A6485 + Poppins w `src/index.css` (@theme v4, bez JS config) + komponenty (Header/ProductGrid)
- [x] E2 — dane inline-curl z cmbtim (nie subagent — ponytail): 8 kategorii + 40 produktów → `products.json` + `getProducts()` (nazwy: kotwice realne, reszta realistyczna)
- [x] F1 — katalog: główna 8 kafli → lista kategorii → karta produktu
- [x] F2 — koszyk (`localStorage`) + checkout mock → "Zamówienie złożone" + clear
- [x] F3 — szukajka (filtr po nazwie, case-insensitive)
- [x] Verify — da-reviewer (spec+diff, świeży kontekst) → SHIP; +1 fix (count derived z items)
- [x] Verify UI — live-pass przez claude-in-chrome (Playwright bez Chrome w env → gan-evaluator/e2e-runner niedostępne); F1/F2/F3 + rubryka wyglądu potwierdzone screenshotami
- [x] Live — `bun run dev` :5174, zero błędów konsoli, 5 screenów (główna/kategoria/koszyk/checkout/szukajka)
