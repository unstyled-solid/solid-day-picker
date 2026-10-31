---
title: Contributing
sidebar_position: 1
---

# Contributing

Use [project issues](https://github.com/unstyled-solid/solid-day-picker/issues) for
bugs, questions, and feature requests. Include a minimal reproduction and your
Solid and DayPicker versions. Pull requests are welcome.

## Working locally

```sh
pnpm install
pnpm docs:build
pnpm docs:dev
```

Guides live in `docs/website/docs`, demos in `docs/examples`, and the Solid site
shell in `docs/site`. API pages are generated from the package declarations.

For documentation changes, run `pnpm docs:types`, `pnpm docs:build`, and
`pnpm docs:check`. Run focused tests when changing interactive behavior.

See the repository's
[contribution guide](https://github.com/unstyled-solid/solid-day-picker/blob/main/CONTRIBUTING.md)
and [release instructions](https://github.com/unstyled-solid/solid-day-picker/blob/main/RELEASING.md).
