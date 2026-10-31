# Solid DayPicker

Customizable date pickers, calendars, and date inputs for **Solid 2**, based on
[React DayPicker](https://github.com/gpbl/react-day-picker) 10.0.2.

This is an experimental port targeting **Solid 2.0.0-rc.13**. Both `solid-js` and
`@solidjs/web` must use that version; Solid 1 is not supported.

## Installation

```sh
npm install @solid-unstyled/daypicker solid-js@2.0.0-rc.13 @solidjs/web@2.0.0-rc.13
```

Use a Solid 2 application with JSX configured for `@solidjs/web`.

## Example

```tsx
import { createSignal } from "solid-js";
import { DayPicker } from "@solid-unstyled/daypicker";
import "@solid-unstyled/daypicker/style.css";

export function Calendar() {
  const [selected, setSelected] = createSignal<Date | undefined>(undefined);
  return (
    <DayPicker
      mode="single"
      selected={selected()}
      onSelect={setSelected}
      footer={selected()?.toLocaleDateString() ?? "Pick a day."}
    />
  );
}
```

## Features

- Single, multiple, range, and custom date selection.
- CSS styling, custom components, and configurable calendar layouts.
- Locales, time zones, ISO week numbering, and broadcast calendars.
- Buddhist, Ethiopic, Hebrew, Hijri, and Persian calendar subpaths.
- Keyboard navigation and screen-reader labels inherited from DayPicker.
- TypeScript declarations and separate browser/server ESM builds.

## Documentation

- [Getting started](docs/website/docs/start.mdx)
- [Guides](docs/website/docs/guides)
- [Package usage and native Solid APIs](packages/solid/README.md)

Run the documentation locally:

```sh
pnpm install
pnpm docs:build
pnpm docs:serve
```

Open http://localhost:3001. See [docs/README.md](docs/README.md) for development
and Netlify deployment instructions.

## Contributing and support

Use this project's [issues](https://github.com/unstyled-solid/solid-day-picker/issues)
for bugs, questions, and feature requests. Pull requests are welcome; see
[CONTRIBUTING.md](CONTRIBUTING.md).

```sh
pnpm typecheck
pnpm test
pnpm build
```

Existing deeper library checks remain available as `verify:packed`,
`verify:source`, `verify:react`, and `test:timezone`.

## Releases

See [RELEASING.md](RELEASING.md) for dry-run, versioning, and publishing commands.

## License and attribution

[MIT](LICENSE). Source, styles, examples, and documentation derive from
React DayPicker by Giampaolo Bellavite and its contributors, pinned to
[`1bfd4f0`](https://github.com/gpbl/react-day-picker/tree/1bfd4f0776d66f2242b6b32a1f084ab94e2702da).
Original notices are retained. The documentation theme also includes MIT-licensed
Docusaurus adaptations. Port history lives in `tracking/PORT.md`.
