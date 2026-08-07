# Architecture

Pokédex is a Nuxt 4 single-page PWA that renders data from the public PokeAPI. It was
migrated from a Nuxt 2 codebase (see `specs/migrate-pokedex-app-to-latest-nuxt/` and
the "replaces the Nuxt 2 …" comments scattered through the source), which explains a
few carry-over patterns noted below.

## Stack

| Concern | Choice |
| --- | --- |
| Framework | Nuxt 4 (Vue 3, `<script setup lang="ts">`) |
| Rendering | `ssr: false` — SPA, prerendered to static HTML via `nuxt generate` |
| State | Pinia (`@pinia/nuxt`), options-style store |
| Styling | Tailwind CSS 3 (`@nuxtjs/tailwindcss`) + SCSS in `app/assets/styles/` |
| Theming | `@nuxtjs/color-mode`, class-based dark mode |
| PWA | `@vite-pwa/nuxt`, `registerType: 'autoUpdate'` |
| Lint | ESLint 9 flat config via `@nuxt/eslint` with stylistic rules |
| Deploy | Netlify, `npm run generate` → `dist/`, Node 22 |

## Directory layout

```
app/
  app.vue                  NuxtLayout + NuxtPage (keepalive)
  layouts/default.vue      max-width wrapper
  pages/
    index.vue              list: search, filters, pagination
    [...slug].vue          details page, catch-all matched on Pokémon name
  components/<name>/<name>.vue
  stores/pokemon.ts        the only store — all API access lives here
  composables/use-change-theme.ts
  types/                   API response + domain types (excluded from linting)
  utils/                   auto-imported helpers (sprite URLs, type icons, random int)
  assets/                  SCSS, type icon SVGs, loading gif
plugins/                   (empty placeholder)
public/                    favicon, PWA icon
nuxt.config.ts             modules, head, color mode, PWA, prerender hook
tailwind.config.js         content globs + dynamic-class safelist
netlify.toml               build command, Node version, lighthouse plugin
```

Components are one-per-folder with a matching file name; Nuxt auto-import flattens
this so `app/components/pokemon-card/pokemon-card.vue` is used as `<pokemon-card>`.

## Data sources

Two distinct PokeAPI surfaces are in play.

**GraphQL — all runtime data.** `GRAPHQL_API` in `app/types/constants.ts` points at
`https://graphql.pokeapi.co/v1beta2`. Every store action POSTs a query there. The
migration collapsed what used to be many REST calls (per card, per ability, per type)
into a handful of queries:

- `getPokemonIndex()` — one query for every Pokémon's id, name, types, species colour,
  generation, and legendary/mythical/baby flags. This single response backs the whole
  list page and all client-side filtering.
- `getMoveIndex()` — every move name plus its damage class, loaded the first time the
  filter sidebar opens.
- `getMovePokemonIds(move)` — the ids of Pokémon that can learn one move, fetched per
  move as it is selected.
- `getPokemonDetails(name)` — one query covering stats, types, abilities and their
  effect text, level-0 moves, species flavour text, damage relations in both
  directions, and the full evolution chain.

**REST — build time only.** The `prerender:routes` hook in `nuxt.config.ts` calls
`https://pokeapi.co/api/v2/pokemon?limit=1118` to enumerate names so `nuxt generate`
emits one static route per Pokémon. It touches nothing at runtime.

Sprites are not fetched from the API at all — `app/utils/sprite-url.ts` builds the
official-artwork URL directly from the Pokémon id against the jsDelivr mirror of the
PokeAPI sprites repo (raw.githubusercontent.com rate-limits bursts).

## State and caching

`app/stores/pokemon.ts` holds four slices, each acting as its own cache:

```ts
pokemonIndex: PokemonIndexEntry[]              // fetched once
pokemonDetails: Record<string, PokemonDetails> // keyed by name
moveIndex: MoveIndexEntry[]                    // fetched once
movePokemonIds: Record<string, number[]>       // keyed by move name
```

Every action returns early if its slice is already populated, so navigating back to a
page or re-selecting a filter costs nothing. Failures are swallowed
(`catch { return; }`) and surface as an empty view rather than an error state.

Raw GraphQL responses are normalised into domain shapes inside the store —
`mapPokemonDetails`, `mapDamageRelations`, and `mapEvolutionStages` flatten the nested
`pokemonstats` / `pokemontypes` / `pokemonspecy` structures so components only see
plain objects.

Pages fetch by calling a store action at the top level of `<script setup>` and
toggling a local `pending` ref — the Nuxt 2 non-blocking `fetch()` hook translated
into Nuxt 4, rather than `useAsyncData`.

## List page (`app/pages/index.vue`)

Everything after the initial index query is computed in memory.

- **Filtering** — `filteredList` applies move, type, generation, category, and search
  filters in sequence. Within a group the values OR together; groups AND with each
  other. Move filters intersect against the cached learner-id sets.
- **Search** — debounced at 250 ms, applied at 3+ characters, matched as a
  case-insensitive regex against the name.
- **URL sync** — `applyFilters()` pushes `search`, `types`, `gens`, `cats`, and
  `moves` query params; `fetchList()` parses them back on load, so any filter state is
  deep-linkable. Adding a filter means touching both functions.
- **Pagination** — only the unfiltered list paginates. `calcPageSize()` measures the
  list container's computed grid columns and row gap and derives how many cards fit
  without scrolling (floor of 20). It re-runs on debounced resize and on `onActivated`
  (the page is kept alive). `CARD_HEIGHT` must match the card's `h-24`. Left/right
  arrow keys page when focus is not in a field.
- When a search or filter is active the pager is replaced by a result count and all
  matches render at once.

## Details page (`app/pages/[...slug].vue`)

The catch-all route takes the Pokémon name from the path and asks the store for its
details. The page is a horizontally scroll-snapped set of sections (Pokédex Data, Base
Stats, Abilities, Type Matchups, Evolution, Moves) under a collapsing header: scroll position drives a `shrink` factor
that is applied as inline `transform` styles to the title, artwork, and background
pokéball, and as the live banner height that the content's top padding follows.

Header and accent colours come from the species colour returned by the API, mapped
through `pokemonColor()` into a Tailwind class name (`white` → `gray-500`, `brown` →
`yellow-800`, `black` → theme-dependent, everything else → `<color>-500`).

## Styling notes

Class names built from data at runtime (`` `bg-${pokemonColor()}` ``,
`` `text-${...}` ``) are invisible to Tailwind's content scanner, so every such class
is listed in the `safelist` array in `tailwind.config.js`. A new colour that is not
safelisted will be purged from the build and silently render unstyled.

Dark mode is class-based; `useChangeTheme()` flips `colorMode.preference` and the
preference persists under the `nuxt-color-mode` storage key.

## Build and deploy

`npm run generate` cleans, then prerenders `/` plus one route per Pokémon into
`dist/`. Netlify runs that command, publishes `dist/`, pins Node 22, and runs the
Lighthouse plugin. Because `ssr: false`, the generated HTML is an SPA shell — all data
is fetched in the browser on first paint.
