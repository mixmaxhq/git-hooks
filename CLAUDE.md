# git-hooks — repo card

> A map, not a manual. Keep it ~1 screen; point to detail, don't inline it.

## What it is
Shared Husky git hooks for all Mixmax repositories, published as `@mixmaxhq/git-hooks`. Enforces Conventional Commits via `commitlint` on `commit-msg` and `pre-push` events, opt-in per developer via `~/.config/mixmax/config`.

## serves
role: npm library — provides the `.huskyrc.js` export and `mixmax-git-hooks` CLI that each consuming repo installs as a dev dependency to enforce commit message linting
referenced-by: [all mixmaxhq repos that use semantic-release + Husky (install `@mixmaxhq/git-hooks` and copy `.huskyrc.js` to root)]

## Code map
- Library entry (Husky config) -> `src/index.ts`
- CLI entry (hook runner) -> `src/bin/index.ts`
- Hook implementations -> `src/bin/hook-commands/commit-msg.ts`, `src/bin/hook-commands/pre-push.ts`
- Developer config reader -> `src/bin/config.ts`
- Git utilities -> `src/bin/git-utils.ts`
- Compiled output -> `dist/` (generated; not checked in)

## Conventions
- TypeScript source in `src/`, compiled to CommonJS in `dist/` via `tsc` (no Babel/Rollup for the main build; `babel.rollup.config.js` is present but unused in the main flow)
- Hooks are opt-in per developer via `~/.config/mixmax/config` (TOML); defaults are `false` — never enable globally
- Published to npm as a public package under `@mixmaxhq` scope; released via `semantic-release` (do not publish manually)
- No tests yet (`npm test` exits 1); lint via `npm run ci` (ESLint + `tsc --noEmit`)

## Gotchas
- The `.huskyrc.js` file must be copied to each consuming repo root (adjacent to `.git`) — it is not auto-installed
- Husky v4 is pinned; upgrading to v8+ changes the hook config format significantly
- `pre_push_mode` in developer config is **required** when `pre_push = true`; omitting it causes a silent failure

## Run / test
```sh
npm run build      # compile src/ → dist/
npm run lint       # ESLint + tsc type-check
# Publishing (CI only):
GH_TOKEN=xxx npx semantic-release --no-ci
```

## Load the matching domain card
This repo is cross-cutting tooling — it owns no product domain, so there is no domain card to load. When working here, load the card of the consuming service/domain if the change is driven by its needs.
