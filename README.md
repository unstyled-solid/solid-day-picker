# Solid DayPicker

[![Qualification](https://github.com/unstyled-solid/solid-day-picker/actions/workflows/qualification.yml/badge.svg?branch=main&event=push)](https://github.com/unstyled-solid/solid-day-picker/actions/workflows/qualification.yml?query=branch%3Amain+event%3Apush)

Customizable date pickers, calendars, and date inputs for **Solid 2**, based on
[React DayPicker](https://github.com/gpbl/react-day-picker) 10.0.2.

Bring your own styles and calendar layouts, with native Solid reactivity and
composition. Maintained independently by [Unstyled Solid](https://github.com/unstyled-solid).

---

This is an experimental port targeting **Solid 2.0.0-rc.20**. Both `solid-js` and
`@solidjs/web` must use that version; Solid 1 is not supported.

## Installation

```sh
npm install @solid-unstyled/daypicker solid-js@2.0.0-rc.20 @solidjs/web@2.0.0-rc.20
```

Use a Solid 2 application with JSX configured for `@solidjs/web`.
Use the matching Solid 2 compiler; see the [package guide](packages/solid/README.md)
for native Solid APIs.

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

The [upstream documentation](https://daypicker.dev) describes React DayPicker;
use this repository's guides for Solid imports and runtime conventions.

Run the documentation locally:

```sh
pnpm install
pnpm docs:build
pnpm docs:serve
```

Open http://localhost:3001. See [docs/README.md](docs/README.md) for development
and Netlify deployment instructions.

## Contributing

Bug reports, improvements, and pull requests are welcome. See
[CONTRIBUTING.md](CONTRIBUTING.md) for setup and development guidance.

```sh
pnpm typecheck
pnpm test
pnpm build
```

The badge above tracks the latest push-triggered qualification run on `main`,
covering library and installed-package checks alongside documentation builds
and browser checks. See the [workflow](.github/workflows/qualification.yml) for commands.

## Releases

See [GitHub releases](https://github.com/unstyled-solid/solid-day-picker/releases)
for release notes and [RELEASING.md](RELEASING.md) for versioning and publishing
instructions. The package name is `@solid-unstyled/daypicker`.

## Community

For questions, feedback, and bug reports, [open an issue](https://github.com/unstyled-solid/solid-day-picker/issues).
Include your Solid and package versions and a minimal reproduction when reporting a bug.

## License and attribution

[MIT](LICENSE). Source, styles, examples, and documentation derive from
React DayPicker by Giampaolo Bellavite and its contributors, pinned to
[`1bfd4f0`](https://github.com/gpbl/react-day-picker/tree/1bfd4f0776d66f2242b6b32a1f084ab94e2702da).
Original notices are retained in the [package notice](packages/solid/NOTICE).
The documentation theme also includes MIT-licensed Docusaurus adaptations;
see [docs/LICENSE](docs/LICENSE).

This is an independent, unofficial Solid port, not maintained by the upstream
DayPicker team. Thanks to the [React DayPicker contributors](https://github.com/gpbl/react-day-picker/graphs/contributors).
