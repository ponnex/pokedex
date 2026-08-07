# AGENTS.md

Working instructions for coding agents in this repository. See `ARCHITECTURE.md` for
how the app is put together.

## Project in one line

A Nuxt 4 + TypeScript + Tailwind CSS Pokédex PWA. Client-rendered (`ssr: false`),
statically generated, deployed to Netlify. All data comes from the public PokeAPI.

## Commands

Every command below exists in `package.json`:

```bash
npm install        # install dependencies (Node >= 22, see .nvmrc)
npm run dev        # dev server on 0.0.0.0:3000
npm run build      # production build
npm run start      # preview the production build
npm run generate   # static generation into dist/ (this is what Netlify runs)
npm run lint       # eslint . — the only automated check in the repo
npm run clean      # remove dist/, .output/, .nuxt/
```

There is **no test suite and no typecheck script**. `vue-tsc` is installed but not
wired to a script. Do not invent `npm test` or `npm run typecheck` — run
`npm run lint` to verify a change, and run the app if the change is visual.

Note that `npm run generate` prerenders one route per Pokémon (~1100 routes) and is
slow. Prefer `npm run dev` or `npm run build` while iterating.

## Code style — enforced by ESLint, gets tripped over constantly

The ESLint config (`eslint.config.mjs`, plus the `eslint.config.stylistic` block in
`nuxt.config.ts`) enforces a style that differs from the common defaults. Match it:

- **Tabs for indentation**, in `.ts` and in Vue templates (`@stylistic/indent: tab`,
  `vue/html-indent: tab`).
- **No space before a function paren**: `const fetchList = async() => {` — not
  `async () =>`.
- **Spaces inside array brackets**: `[ 'legendary', 'mythical', 'baby' ]`.
- **Semicolons always**, **trailing commas on multiline** literals.
- `prefer-template` over string concatenation.
- Quote props only as needed.

`app/types/**` is excluded from linting — those files are ported verbatim from the
Nuxt 2 app and use loose types (`any`) on PokeAPI response models.

## Conventions

- **Components live in a folder of the same name**:
  `app/components/pokemon-card/pokemon-card.vue`. Nuxt auto-import flattens this, so
  the component is used as `<pokemon-card>`. Follow the pattern for new components.
- **Kebab-case file names** throughout (`use-change-theme.ts`, `sprite-url.ts`).
- `<script setup lang="ts">` for all components and pages.
- Auto-imports are on: `ref`, `computed`, `useRoute`, `usePokemonStore`,
  `useChangeTheme`, utils from `app/utils/` — do not add explicit imports for these.
- Data fetching happens by calling a store action at setup top level and flipping a
  local `pending` ref (see `app/pages/index.vue`), not via `useAsyncData`. This is a
  deliberate carry-over from the Nuxt 2 non-blocking `fetch()` hook.
- Store actions are memoized in state and swallow errors with a bare `catch { return; }`.
  Callers treat a missing result as "nothing to render".

## Gotchas

- **Tailwind safelist.** Colors are composed at runtime from API data
  (`` :class="`bg-${pokemonColor()}`" `` in `app/pages/[...slug].vue`). Any class
  built that way must be listed in the `safelist` array of `tailwind.config.js` or
  Tailwind purges it and the style silently disappears.
- **Two different PokeAPI surfaces.** Runtime data uses the GraphQL endpoint
  (`GRAPHQL_API` in `app/types/constants.ts`). The `prerender:routes` hook in
  `nuxt.config.ts` separately hits the **REST** endpoint to enumerate route names.
  Changing one does not change the other.
- **Card height is duplicated.** `CARD_HEIGHT = 96` in `app/pages/index.vue` must
  stay in sync with the `h-24` on `pokemon-card`; pagination sizing reads from it.
- `.nuxt/` is generated and `eslint.config.mjs` imports from it — run `npm run dev`
  or `npm run build` at least once after a clean checkout before linting.
- Filter state is mirrored into the URL query (`search`, `types`, `gens`, `cats`,
  `moves`). Adding a filter means updating both `applyFilters()` and the query
  parsing in `fetchList()` in `app/pages/index.vue`.

## Scope discipline

`app/types/**` and most component templates are verbatim ports from the Nuxt 2
version of this app. Don't reformat them opportunistically; change what the task
asks for.
