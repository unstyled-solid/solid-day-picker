# Releases

## npm

The published package is `@solid-unstyled/daypicker`, built from `packages/solid`.
Its published README is `packages/solid/README.md`.

Use an exact version. The script updates the package and lockfile, builds, and
runs npm's publish dry-run. Prereleases default to the `next` tag; stable versions
default to `latest`. Override with `--tag`.

```sh
# Preview the requested release; restore version/lockfile afterward.
pnpm release:npm 10.0.2-solid.1 --dry-run

# Prepare the version and lockfile locally, without publishing.
pnpm release:npm 10.0.2-solid.1

# Explicitly publish after logging into an npm account with scope access.
npm login
pnpm release:npm 10.0.2-solid.1 --publish
```

Dry-run still regenerates build output. No mode commits, tags, or pushes.
Review and commit your changes separately when ready.

## Documentation

```sh
pnpm docs:build
pnpm typecheck
pnpm docs:types
pnpm docs:check
```

Netlify uses root `netlify.toml` and publishes `docs/generated/site`. Connect the
repository and deploy branch in Netlify; use its assigned site URL. See
[docs/README.md](docs/README.md) for explicit CLI draft/production deploy commands.

```sh
pnpm docs:deploy       # build, check, then draft deploy
pnpm docs:deploy:prod  # build, check, then production deploy
```

Existing deeper library/browser audits remain available for investigation; they
are not additional documentation deployment prerequisites.
