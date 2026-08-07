# Spec — Migrate Pokédex app to latest Nuxt

**Status:** Shipped (regenerated retrospectively from the current codebase, 2026-08-01)
**Branch:** `dev` · **Migration commit:** `63093f7` (`refactor: migrate Nuxt 2 to Nuxt 4`) via PR #1 `refactor/nuxt4-migration`

---

## 1. Context

The Pokédex is a statically generated, client-rendered PWA built on the public
[PokeAPI](https://pokeapi.co/), deployed to Netlify. It was originally written on Nuxt 2
(Vue 2, Options API + `nuxt-property-decorator`, Vuex via `nuxt-typed-vuex`, `@nuxtjs/axios`,
`@nuxtjs/pwa`, webpack, node-sass).

That stack is end-of-life: Nuxt 2 and Vue 2 are out of support, `node-sass` does not build on
modern Node, `@nuxtjs/pwa` is unmaintained, and the Netlify build could no longer be pinned to a
Node version that satisfied every dependency at once.

## 2. Goal

Move the app onto the current Nuxt 4 line (`nuxt: ^4.4.8`, `compatibilityDate: 2026-07-09`) with
**no loss of user-facing behaviour**, and leave the codebase on maintained, actively released
dependencies with a Node 22 baseline.

Non-goal for the migration itself: redesigning the UI or changing the data source. (Work that
happened *after* the migration is recorded separately in §7 — it is not part of the migration
requirement set.)

## 3. Scope

### In scope
- Framework upgrade Nuxt 2 → Nuxt 4, Vue 2 → Vue 3 (`<script setup>` + Composition API).
- State management Vuex/`nuxt-typed-vuex` → Pinia.
- HTTP layer `@nuxtjs/axios` → built-in `$fetch` / `ofetch`.
- PWA `@nuxtjs/pwa` → `@vite-pwa/nuxt`.
- Build webpack → Vite; `node-sass` → `sass` (Dart Sass) with `@use`.
- Lint `.eslintrc.js` + `@nuxtjs/eslint-config-typescript` → ESLint 9 flat config via `@nuxt/eslint`.
- Directory move to the Nuxt 4 `app/` srcDir; `static/` → `public/`.
- Static prerendering of one route per Pokémon, preserved from the Nuxt 2 `generate.routes`.
- Netlify build kept green on Node 22.

### Out of scope
- Server-side rendering. The app stays `ssr: false` + `nuxt generate` (SPA, prerendered shell).
- Authentication, backend of our own, analytics, i18n.
- Test suite. The repo has no automated tests before or after; verification is lint + build +
  manual smoke.

## 4. Functional requirements (parity — must behave as the Nuxt 2 app did)

| # | Requirement |
|---|---|
| FR-1 | **List page** (`/`) shows every Pokémon as a card with official artwork, zero-padded dex number (`#001`), start-cased name and type badges. |
| FR-2 | **Search** filters the list by name (case-insensitive, minimum 3 characters) and is reflected in the `?search=` query param so a search is deep-linkable and survives reload. |
| FR-3 | **Pagination** — the unfiltered list is paged; a filtered/searched list shows all matches at once. |
| FR-4 | **Details page** (`/:name`, catch-all route) shows description, height, weight, base experience, gender rate, growth rate, colour, base stats, abilities with effect text, level-0 moves, type strengths/weaknesses, and the evolution chain. |
| FR-5 | Evolution stages link to the corresponding details page via `NuxtLink` (was `n-link`). |
| FR-6 | **Light/dark theme** toggle persists via `@nuxtjs/color-mode` (`nuxt-color-mode` storage key), default `light`, fallback `system`. |
| FR-7 | **PWA** — installable with the `Pokédex` manifest (name, short name, description, `lang: en`, 512×512 icon) and an auto-updating service worker. |
| FR-8 | **Static generation** produces `/` plus one route per Pokémon name from the PokeAPI list endpoint (`?limit=1118`), output to `dist/` for Netlify. |
| FR-9 | All `/:name` routes are served by the single catch-all page `app/pages/[...slug].vue`, which shows a pokeball loading state while the details query is in flight (`v-show="!pokemon && pending"`) and the content once it resolves (`v-show="pokemon && !pending"`). **Known behaviour, carried over from Nuxt 2:** an unresolvable name leaves both branches hidden — a blank page, not a 404 view. See §9. |

## 5. Non-functional requirements

| # | Requirement |
|---|---|
| NFR-1 | Node ≥ 22 (`engines`, `.nvmrc`, `netlify.toml` `NODE_VERSION`). |
| NFR-2 | TypeScript throughout; `tsconfig.json` extends the generated `.nuxt/tsconfig.json`; `vue-tsc` available for type checking. |
| NFR-3 | `npm run lint` passes on ESLint 9 flat config with the project's stylistic rules — tabs, semicolons, always-multiline trailing commas, `array-bracket-spacing: always`, no space before function paren. |
| NFR-4 | Legacy PokeAPI response model files under `app/types/**` are lint-ignored; they were ported verbatim. |
| NFR-5 | No dependency requiring Node < 22. `@netlify/plugin-lighthouse` is declared in `netlify.toml` to override the outdated UI-installed version. |
| NFR-6 | Styling stays Tailwind 3 + SCSS; no `@import` (deprecated in Dart Sass) — use `@use`. |
| NFR-7 | The app must not depend on any credentialed API. PokeAPI is public and unauthenticated. |

## 6. Constraints and risks

- **PokeAPI rate limits.** Burst per-card requests draw `429`s; sprite hosting on
  `raw.githubusercontent.com` does the same. Any data strategy must keep request counts low.
- **Prerender fan-out.** The `prerender:routes` hook adds ~1100 routes; the build must stay within
  Netlify's build time.
- **Verbatim templates.** Vue templates were carried over from Nuxt 2 with minimal edits, so several
  `vue/*` lint rules are disabled rather than reformatting 1000+ lines during a migration.

## 7. Post-migration evolution (current state, **not** migration requirements)

After `63093f7` the app moved past Nuxt 2 parity. These changes are described here so this spec
matches the codebase as it stands today; they were not part of the migration goal.

**Data layer — REST → PokeAPI GraphQL** (`https://graphql.pokeapi.co/v1beta2`, `app/types/constants.ts`)
- `getPokemonIndex()` — one query returns id, name, types, species colour, generation, and the
  legendary/mythical/baby flags for every Pokémon. Replaces two REST calls per card.
- `getPokemonDetails(name)` — one query returns stats, types with both damage-efficacy directions,
  abilities with English effect text, level-0 moves, species flavour text/colour/growth rate/gender
  rate, and the evolution chain. Replaces the pokemon + species + evolution-chain REST calls plus
  per-ability and per-type calls the child components made.
- `getMoveIndex()` — full move list with damage class (~900 entries) for the sidebar move browser.
- `getMovePokemonIds(move)` — ids of every Pokémon that learns a move, cached per move.
- All four results are cached in the Pinia store and served from memory on repeat access.

**Filtering** (`app/components/pokemon-filter-sidebar/`, `pokemon-type-filter/`, `pokemon-active-filters/`)
- Slide-over sidebar (teleported, Escape-to-close, overlay click-to-close) with four filter groups:
  type, generation (Gen I–IX), category (legendary / mythical / baby), and moves.
- Moves are browsed by damage-class pill (physical / special / status) and/or a 2+ character move
  search; matches are added as individual move filters.
- Semantics: **OR within a group, AND across groups.** A Pokémon matches if it has *any* selected
  type, *and* is in *any* selected generation, and so on.
- Active filters render as removable pills above the list; a badge on the Filters button shows the
  active count; "Clear all" resets every group.
- Full filter state round-trips through the URL — `?search`, `?types`, `?gens`, `?cats`, `?moves`
  (comma-separated) — and is restored on load.

**List UX** (`app/pages/index.vue`)
- Live search, debounced 250 ms, applied at ≥ 3 characters; clearing restores the full list.
- Page size is computed from the list container's measured grid columns and row height
  (`CARD_HEIGHT = 96`, matching the card's `h-24`), with a floor of 20 per page; recalculated on
  debounced resize and on `onActivated`, clamping the current page back into range.
- Page indicator ("Page N of M") with fixed-position prev/next buttons that stay mounted and dim
  when disabled; ArrowLeft/ArrowRight page the list unless focus is in an input/textarea/select.
- Skeleton cards (`pokemon-card-skeleton`) fill a page while the index query is in flight.
- Empty state adapts its message to whether a search, filters, or both are responsible, and offers
  the matching recovery action.
- The list scrolls to top on any page or filter change.
- A filtered/searched list replaces the pager with a result count (`{{ filteredList.length }} Pokémon found`).
- The details page gained a scroll-linked collapsing header with a parallax pokeball watermark, driven off a single `scrollTop` ref.

**Assets and performance**
- Official artwork is served from the jsDelivr mirror of `PokeAPI/sprites`
  (`app/utils/sprite-url.ts`) to avoid GitHub raw rate limiting; card images lazy-load.
- Cards use fixed heights to avoid layout shift; store lookups are O(1) by keyed record.

## 8. Acceptance criteria

1. `npm run lint` exits clean.
2. `npm run generate` completes and emits `dist/` containing `index.html` plus a directory per
   Pokémon route.
3. `npm run dev` serves the list; searching, filtering, paging and opening a details page all work
   without console errors.
4. Theme toggle switches light/dark and survives a reload.
5. The generated build registers a service worker and exposes a valid web manifest.
6. Netlify deploy from `netlify.toml` succeeds on Node 22.
7. No `nuxt@2`, `vuex`, `axios`, `node-sass`, `nuxt-property-decorator`, `lodash-humps`, or
   `@nuxtjs/pwa` remains in `package.json`.

## 9. Open behaviour gap

An unknown Pokémon name (`/notapokemon`) renders a blank page: `getPokemonDetails` returns
`undefined`, `pending` flips to `false`, and both `v-show` branches in `[...slug].vue` evaluate
false. This matches the Nuxt 2 behaviour and so was not a migration regression, but it is not
acceptable end state — a "not found" view with a link home (the page already has an `onHome()`
handler) is the obvious fix.
