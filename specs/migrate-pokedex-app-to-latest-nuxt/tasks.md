# Tasks — Migrate Pokédex app to latest Nuxt

All tasks below are **done** — this list is reconstructed from the shipped code and git history on
`dev` (2026-08-01). Each task cites the commit that delivered it. Phases are grouped by theme, not
strictly by date: a few commits (e.g. 4.1 `a059e12`) landed before the phase they belong to.

---

## Phase 1 — Framework migration (`63093f7`, merged in `b5e0b4e`)

| # | Task | Status |
|---|---|---|
| 1.1 | Replace Nuxt 2 deps with `nuxt@^4`, `pinia` + `@pinia/nuxt`, `@vite-pwa/nuxt`, `lodash-es`, `sass`, `eslint@9` + `@nuxt/eslint`, `vue-tsc`; drop `axios`, `nuxt-typed-vuex`, `nuxt-property-decorator`, `core-js`, `node-sass`, `lodash-humps`, `@nuxtjs/pwa` | done |
| 1.2 | Rewrite `nuxt.config.ts` — `ssr:false`, single `modules` array, `app.head`, `colorMode`, `pwa`, `eslint.config.stylistic`, `compatibilityDate` | done |
| 1.3 | Port `generate.routes` to the `prerender:routes` hook (PokeAPI `?limit=1118`, `/` + one route per name) | done |
| 1.4 | Move sources into the Nuxt 4 `app/` srcDir; `static/` → `public/` | done |
| 1.5 | Delete Nuxt-2-only files: `.eslintrc.js`, `index.d.ts`, `jsconfig.json`, `environment/`, `store/`, `plugins/axios.ts`, directory `README.md` stubs | done |
| 1.6 | Add `app/app.vue` (`<NuxtLayout><NuxtPage keepalive /></NuxtLayout>`) and `app/layouts/default.vue` | done |
| 1.7 | Port Vuex store → `app/stores/pokemon.ts` Pinia store with per-entity caching | done |
| 1.8 | Rewrite `pages/index.vue` as `<script setup>`; Nuxt 2 `fetch()` → async setup call + `pending` ref | done |
| 1.9 | Rewrite `pages/_.vue` → `pages/[...slug].vue` details page | done |
| 1.10 | Convert all components to `<script setup lang="ts">` with `defineProps`/`defineEmits`; `n-link` → `NuxtLink` | done |
| 1.11 | `ChangeTheme` mixin → `app/composables/use-change-theme.ts` | done |
| 1.12 | Extract auto-imported helpers into `app/utils/` (`number.ts`, `type-icon.ts`) | done |
| 1.13 | Replace `@nuxtjs/axios` calls with `$fetch` | done |
| 1.14 | ESLint 9 flat config (`eslint.config.mjs`) — tab indent, semi, trailing commas, `array-bracket-spacing: always`; ignore `app/types/**`; relax `vue/*` formatting rules for verbatim-ported templates | done |
| 1.15 | `tsconfig.json` extends `.nuxt/tsconfig.json` | done |
| 1.16 | Update scripts: `nuxt start` → `nuxt preview`, `clean` also removes `.output`/`.nuxt`, `lint:js` → `eslint .` | done |

## Phase 2 — Build & deploy on Node 22

| # | Task | Commit | Status |
|---|---|---|---|
| 2.1 | Pin Node 22 for Netlify (`.nvmrc`, `engines.node`) | `e1ac293` | done |
| 2.2 | Declare `@netlify/plugin-lighthouse` in `netlify.toml` to override the Node-<20 UI-installed version | `3d324a3` | done |
| 2.3 | Add `@netlify/plugin-lighthouse@^6` as a devDependency to force the Node 22 compatible release | `4e2131c` | done |
| 2.4 | Replace deprecated Sass `@import` with `@use` | `0c70988` | done |

## Phase 3 — Data layer: REST → PokeAPI GraphQL

| # | Task | Commit | Status |
|---|---|---|---|
| 3.1 | Serve official artwork from the jsDelivr sprites mirror and lazy-load card images (fixes PokeAPI/GitHub `429`s) | `c42eb9a` | done |
| 3.2 | Fetch card details only when scrolled into view; parallelise per-card requests (interim step) | `29a7b6a` | done |
| 3.3 | Fix card layout shift with fixed heights; O(1) store lookups | `e8aa7e4` | done |
| 3.4 | Replace per-card REST calls with a single GraphQL index query (`getPokemonIndex`) | `b24c4a6` | done |
| 3.5 | Collapse the details page onto one GraphQL query (`getPokemonDetails`) with mappers for damage relations and evolution stages; add move-filter store actions | `144861a` | done |

## Phase 4 — Filtering

| # | Task | Commit | Status |
|---|---|---|---|
| 4.1 | Add type filter chips backed by the PokeAPI type endpoint | `a059e12` | done |
| 4.2 | Filter sidebar with type, generation and category groups; URL round-trip of filter state | `50c4ae4` | done |
| 4.3 | Type filters match **any** selected type (OR within a group) instead of requiring all | `fd60c1d` | done |
| 4.4 | Moves filter with live search and list UX polish | `d889cce` | done |
| 4.5 | Browse moves by damage class (physical/special/status) instead of text search only | `0d108e6` | done |
| 4.6 | Move the move-search input alongside the category pills in the sidebar | `1f1b926` | done |
| 4.7 | Active-filter pills above the list with uniform height and a count badge on the Filters button | `ffd9f3e` | done |

## Phase 5 — List UX

| # | Task | Commit | Status |
|---|---|---|---|
| 5.1 | Skeleton cards while the index query loads | `321862c` | done |
| 5.2 | Viewport-adaptive page size with a 20-card minimum | `cb8aa3c` | done |
| 5.3 | Pagination with "Page N of M" indicator, always-mounted prev/next arrows, ArrowLeft/ArrowRight keyboard nav | `3853106` | done |
| 5.4 | Lift the pagination bar off the viewport bottom | `510819a` | done |
| 5.5 | Type-chip styling: neutral idle, type colour on hover/active, hovered vs active differentiation, readable label on hover | `87ba5a7`, `8397927`, `bbbedcf`, `1a7b262` | done |
| 5.6 | Keep list cards compact (`h-24`) on large screens | `7c62444` | done |

## Verification

Only the two static checks below were re-run while regenerating these docs (2026-08-01). The build,
smoke, and deploy gates listed in [`plan.md`](./plan.md) §7 were exercised when the work originally
shipped and were **not** re-run here — treat them as the standing gate, not as fresh results.

| Check | Re-run 2026-08-01 | Result |
|---|---|---|
| `npm run lint` (ESLint 9 flat config) | yes | clean, no output |
| `npx vue-tsc --noEmit` | yes | clean, exit 0 |
| `npm run generate` → `dist/` | no | — |
| Manual smoke: list, search, filters, pagination, details, theme | no | — |
| Netlify deploy on Node 22 | no | — (live at https://pokedex-ponnex.netlify.app/) |

## Known gaps / follow-ups

- **No automated tests.** Neither the Nuxt 2 app nor the migrated app has a test suite; every gate
  above is lint, build, or manual. A Vitest + `@nuxt/test-utils` setup covering the store mappers
  (`mapDamageRelations`, `mapEvolutionStages`) and the `filteredList` computed would be the highest
  value first suite.
- **`app/types/**` is lint-ignored** — the PokeAPI response models were ported verbatim and still
  contain `any` members.
- **Several `vue/*` formatting rules are disabled** to avoid reformatting templates during the
  migration; they could be re-enabled with a one-off `--fix` pass.
- **`app/types/pokemon-list.ts` still exports `PokemonList` / `PokemonListResponse`**, used only by
  the `prerender:routes` REST call — the last REST dependency in the codebase.
- **`plugins/` contains only a README stub** and can be deleted.
- **No "not found" view.** An unknown `/:name` renders blank (spec §9); add a not-found branch to
  `[...slug].vue` wired to the existing `onHome()`.
