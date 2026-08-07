# CLAUDE.md

Agent instructions for this repository live in **[AGENTS.md](./AGENTS.md)** — read it
first. It covers the available npm scripts, the enforced ESLint style (tabs,
`async()` with no space, `[ spaced ]` array brackets), file/component conventions,
and the gotchas that are easy to trip over.

Structure and data flow are documented in **[ARCHITECTURE.md](./ARCHITECTURE.md)**.

## Claude Code specifics

- Verify a change with `npm run lint`. There is no test suite and no typecheck
  script — do not report "tests pass".
- `npm run generate` prerenders ~1100 routes and takes minutes. Use `npm run dev` or
  `npm run build` when iterating; only run `generate` when the static output itself
  is what is being checked.
- `.nuxt/` and `dist/` are build output. Never edit them, and don't include them when
  searching for source.
- Prefer `Grep`/`Glob` scoped to `app/` — a repo-wide search picks up thousands of
  generated lines from `.nuxt/` and `node_modules/`.
- Work happens on the `dev` branch; `main` is the PR target. Don't commit or push
  unless asked.
