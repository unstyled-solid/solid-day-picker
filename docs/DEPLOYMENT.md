# Netlify documentation site

Import `unstyled-solid/solid-day-picker` into Netlify and deploy the repository
root. `netlify.toml` selects Node 24.22.2 LTS, pnpm 11.8.0, frozen installation,
`pnpm docs:build && pnpm docs:check`, and publish directory `docs/generated/site`.
No dashboard environment variables, credentials, framework adapter or npm
publication are required. Installation requires access to the public npm registry.

The site uses Vite plus build-time Solid rendering, not a deployed SSR server.
The build creates the library, API docs, captured content and static routes with
native interactive islands. Only the static site directory is published; the
generated server bundle is build-time machinery. The upstream submodule is not
needed for this build: the required source snapshot is committed under `docs/`.

Routes, links and assets are site-root-relative, so Netlify's assigned URL or a
custom domain works without an origin or subpath variable. Use the repository
root as the base directory, not `docs/`.

Local equivalent with the configured Node and pnpm versions:

```sh
pnpm install --frozen-lockfile
pnpm docs:build
pnpm docs:check
pnpm docs:serve
```

Each documentation route has real generated HTML, including nested directory
indexes. Netlify's normal static routing handles extensionless deep links.
Unknown routes retain Netlify's real 404; do not install an SPA fallback.
Local validation does not constitute a hosted Netlify deployment.
