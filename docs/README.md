# Documentation website

The Solid documentation adapts React DayPicker's guides, examples, assets, and
Docusaurus theme. Original MIT notices are retained in `LICENSE` and
`site/LICENSE.docusaurus`.

## Local development

Run from the repository root with Node 22.14+ and the pnpm version in `package.json`:

```sh
pnpm install
pnpm docs:build
pnpm docs:serve
```

Open http://localhost:3001. For live editing, use `pnpm docs:dev` after the initial
build. Content lives in `docs/website/docs`, demos in `docs/examples`, and the
Solid site shell in `docs/site`. API pages are generated from package declarations.

`docs:build` rebuilds the package, API, page registry, and static site in order.
Do not hand-edit `docs/generated`.

## Checks

```sh
pnpm typecheck
pnpm docs:types
pnpm docs:check
```

`docs:check` checks local links and assets in the built HTML and CSS. For deeper
interactive coverage, `pnpm docs:test:browser` runs against Vite preview.

## Netlify

Connect `https://github.com/unstyled-solid/solid-day-picker` in Netlify and select the
branch to deploy. Root `netlify.toml` configures the build and publishes
`docs/generated/site`; use Netlify's assigned URL. No custom domain is assumed.

For an explicitly invoked draft deploy (the command fetches the Netlify CLI,
builds, checks local links/assets, and uses your Netlify login/site connection):

```sh
pnpm docs:deploy
```

Use `pnpm docs:deploy:prod` only when intentionally deploying to production.
Configure a Netlify site connection before using these commands. Netlify's Git
integration builds automatically when you explicitly push to the connected branch.
