# Plan — Migrate Pokédex app to latest Nuxt

Companion to [`spec.md`](./spec.md). Regenerated from the current codebase, 2026-08-01.

---

## 1. Target architecture

```
nuxt.config.ts          ssr:false · modules · prerender:routes hook · pwa · colorMode · eslint
netlify.toml            command: npm run generate · publish: dist · NODE_VERSION 22
.nvmrc                  22
eslint.config.mjs       flat config, withNuxt(...)
tailwind.config.js      Tailwind 3
plugins/                (empty — the Nuxt 2 axios plugin is gone)

app/                    Nuxt 4 srcDir
├─ app.vue              <NuxtLayout><NuxtPage keepalive /></NuxtLayout>
├─ layouts/default.vue  max-width shell
├─ pages/
│  ├─ index.vue         list · search · filters · pagination
│  └─ [...slug].vue     details (catch-all, replaces Nuxt 2 pages/_.vue)
├─ components/          pokemon-card · pokemon-card-skeleton · pokemon-type-badge ·
│                       pokemon-stats-bar · pokemon-damage-relation · pokemon-evolution-stage ·
│                       pokemon-filter-sidebar · pokemon-type-filter · pokemon-active-filters
├─ composables/use-change-theme.ts
├─ stores/pokemon.ts    Pinia store — index, details, moves, move→pokemon ids
├─ types/               constants · pokemon · pokemon-list · pokemon-details
├─ utils/               number · sprite-url · type-icon   (auto-imported)
└─ assets/              styles/{main,tailwind}.scss · images/types/*.svg · pokeball_loading.gif

public/                 favicon.ico · icon.png   (was static/)
```

## 2. Dependency mapping

| Nuxt 2 | Nuxt 4 | Note |
|---|---|---|
| `nuxt@^2.14` | `nuxt@^4.4.8` | Vue 3, Nitro, Vite |
| `nuxt-property-decorator`, `@nuxt/typescript-runtime`, `@nuxt/typescript-build`, `@nuxt/types` | — | replaced by `<script setup lang="ts">` and Nuxt's built-in TS |
| `nuxt-typed-vuex` + `store/` | `pinia` + `@pinia/nuxt`, `app/stores/` | |
| `@nuxtjs/axios` + `plugins/axios.ts` | built-in `$fetch` (ofetch) | no plugin needed |
| `@nuxtjs/pwa` | `@vite-pwa/nuxt` | `registerType: 'autoUpdate'`, `registerWebManifestInRouteRules: true` |
| `lodash-humps` (+ webpack `ProvidePlugin` for `_`) | `lodash-es` + `@types/lodash-es`, explicit imports | snake→camel mapping now done in the store's mappers |
| `node-sass` + `sass-loader` | `sass` (Dart Sass) | `@import` → `@use` |
| `@nuxtjs/eslint-config-typescript`, `eslint-plugin-nuxt`, `babel-eslint`, `eslint@7` | `@nuxt/eslint`, `eslint@9` flat config | stylistic: tab indent, semi, always-multiline commas |
| `core-js`, `autoprefixer`, `postcss` (explicit) | — | handled by Vite / `@nuxtjs/tailwindcss` |
| `@nuxtjs/color-mode@2` | `@nuxtjs/color-mode@4` | same options shape |
| `nuxt start` | `nuxt preview` | |
| `environment/defaults*.json` + `NormalModuleReplacementPlugin` | — | the single constant lives in `app/types/constants.ts` |

## 3. Config translation

- `target: 'static'` → dropped; `ssr: false` + `nuxt generate` is the Nuxt 4 equivalent.
- `head: {...}` → `app.head: {...}`; `meta` entries lose the Nuxt 2 `hid` key.
- `buildModules` + `modules` → one `modules` array.
- `components: true` → default behaviour (auto-import); nested directories resolve as
  `pokemon-card/pokemon-card.vue` → `<pokemon-card>`.
- `generate.routes` → the `prerender:routes` hook: fetch
  `https://pokeapi.co/api/v2/pokemon?limit=1118`, add `/` and `/{name}` for every result.
- `build.extend` / `build.plugins` (webpack) → removed entirely; Vite needs neither.
- `compatibilityDate: '2026-07-09'` pins Nitro behaviour.
- `eslint.config.stylistic` in `nuxt.config.ts` drives the generated `.nuxt/eslint.config.mjs` that
  `eslint.config.mjs` extends.

## 4. Migration sequencing

1. **Scaffold** — install Nuxt 4 + modules, write `nuxt.config.ts`, move sources into `app/`,
   `static/` → `public/`, delete Nuxt-2-only files (`.eslintrc.js`, `index.d.ts`, `jsconfig.json`,
   `environment/`, `store/`, the per-directory `README.md` stubs, `plugins/axios.ts`).
2. **State** — port `store/pokemon.ts` to a Pinia store; state as a plain object, mutations folded
   into actions, per-entity caches keyed by name.
3. **Pages** — rewrite `index.vue` and `pages/_.vue` → `pages/[...slug].vue` as `<script setup>`.
   Nuxt 2's non-blocking `fetch()` hook becomes a plain async call made during setup, with a
   `pending` ref driving the loading UI.
4. **Components** — convert each SFC to `<script setup lang="ts">` with `defineProps` /
   `defineEmits`; drop `nuxt-property-decorator` decorators; `n-link` → `NuxtLink`.
5. **Composables/utils** — the `ChangeTheme` mixin becomes `useChangeTheme()`; helper functions move
   to `app/utils/` for auto-import.
6. **Styles** — Dart Sass `@use`, Tailwind config carried over.
7. **Lint** — flat config; disable the `vue/*` formatting rules that would otherwise force a rewrite
   of verbatim-ported templates; ignore `app/types/**`.
8. **Deploy** — `.nvmrc` 22, `engines.node >= 22`, `netlify.toml` with `NODE_VERSION = "22"` and an
   explicit `@netlify/plugin-lighthouse` declaration to override the stale UI-installed plugin.

## 5. Data-layer plan (post-migration hardening, §7 of the spec)

Straight REST parity was correct but slow and rate-limit-prone: the list issued two requests per
card and the details page issued five-plus. The plan that replaced it:

1. Point the store at the PokeAPI **GraphQL** endpoint (`GRAPHQL_API` in `app/types/constants.ts`),
   posting `{ query, variables }` with `$fetch`.
2. One index query for the whole list; one details query per Pokémon; one move-list query; one
   query per selected move. Every result memoised in store state, so navigating back to a visited
   page issues zero requests.
3. Map raw snake_case GraphQL rows into camelCase view models inside the store
   (`mapPokemonDetails`, `mapDamageRelations`, `mapEvolutionStages`), so components stay dumb.
4. Damage relations are derived from `typeefficacies` (damage dealt) and
   `TypeefficaciesByTargetTypeId` (damage taken), bucketed at `damage_factor` 200 (`double`) and
   50 (`half`) and de-duplicated with `uniqBy`.
5. Evolution stages are built by joining each species to its `evolves_from_species_id` and reading
   `pokemonevolutions[0].min_level`.
6. Serve sprites from the jsDelivr mirror to sidestep GitHub raw rate limiting.
7. Every action swallows failures and returns `undefined` — a dead API degrades to an empty list,
   never an unhandled rejection.

## 6. Filtering plan (post-migration)

- Single `PokemonFilters` object (`types`, `generations`, `categories`, `moves`) owned by
  `index.vue`, passed to the sidebar as `v-model`.
- All filtering is a chain of `computed` over the in-memory index — no request per keystroke or
  toggle. Only newly selected *moves* trigger a (cached) query.
- `applyFilters()` is the single write path: normalise search (≥ 3 chars), reset to page 0,
  serialise state into the URL query, prefetch move ids, scroll the list to top.
- Load-time restore parses the same query params back into state, validating category values
  against the allowed set.

## 7. Verification

No test suite exists. The gate is:

```bash
npm run lint       # ESLint 9 flat config
npx vue-tsc --noEmit
npm run dev        # smoke: list, search, filters, pagination, details, theme
npm run generate   # ~1100 prerendered routes into dist/
```

plus a Netlify deploy preview (Lighthouse plugin runs there).

## 8. Rollback

The migration landed as a single squashable branch (`refactor/nuxt4-migration`, merged in
`b5e0b4e`). Reverting that merge restores the working Nuxt 2 tree; Netlify redeploys from the
previous commit. After the GraphQL and filtering work landed on top, rollback is no longer a
single revert — treat the Nuxt 2 tree as archived history only.
