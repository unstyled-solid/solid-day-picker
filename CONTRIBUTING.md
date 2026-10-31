# Contributing

Report bugs, ask questions, or suggest features in
[this project's issues](https://github.com/unstyled-solid/solid-day-picker/issues).
Include a minimal reproduction and your Solid/package versions for bugs.

## Development

Use Node 22.14+ and pnpm 11.8.0:

```sh
pnpm install
pnpm build
pnpm dev
```

Library source is in `packages/solid/src`; demos are in `examples` and
`docs/examples`. `upstream/react-day-picker` is the pinned upstream reference.
Preserve its notices and attribution when adapting code.

Run `pnpm typecheck` and focused tests for behavior you change. Documentation
changes use `pnpm docs:build`, `pnpm docs:types`, and `pnpm docs:check`.
See [docs/README.md](docs/README.md) and [RELEASING.md](RELEASING.md).
