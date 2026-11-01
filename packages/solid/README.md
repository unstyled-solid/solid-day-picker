# Solid DayPicker

Date pickers and calendars for Solid 2, based on React DayPicker 10.0.2.
An experimental port targeting **Solid 2.0.0-rc.20**; Solid 1 is not supported.

## Installation

```sh
npm install @solid-unstyled/daypicker solid-js@2.0.0-rc.20 @solidjs/web@2.0.0-rc.20
```

Configure your Solid 2 app's JSX for `@solidjs/web`. State comes from `solid-js`;
JSX types, rendering, and hydration come from `@solidjs/web`.

## Usage

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

Supports single, multiple, range, and custom selections; localized labels, time
zones, keyboard navigation, configurable layouts, and custom components.
Import the default stylesheet or use `@solid-unstyled/daypicker/style.module.css`
with the `classNames` prop for CSS Modules.

## Calendars and locales

```tsx
import { DayPicker } from "@solid-unstyled/daypicker/persian";
import { fr } from "@solid-unstyled/daypicker/locale";
```

Calendar subpaths are `/buddhist`, `/ethiopic`, `/hebrew`, `/hijri`, and `/persian`.
Each exports its calendar-specific `DayPicker` and locale helpers. The core
`/locale` and `/locale/*` exports provide Gregorian locales.

## Native Solid APIs

- Use `class`, `tabindex`, callback refs, native DOM events, and hyphenated
  inline CSS properties.
- `useDayPicker()` returns a live getter-based context. Read changing fields
  inside JSX, accessors, or memos; destructuring during setup takes a snapshot.
- Custom components retain DayPicker's slot structure. Forward live props with
  Solid's `omit` and `merge` and preserve refs, ARIA attributes, and handlers.
- Browser and server ESM builds are selected by export conditions. No CommonJS
  build is provided.

```tsx
import { useDayPicker } from "@solid-unstyled/daypicker";

export function CurrentSelection() {
  const calendar = useDayPicker<{ mode: "single"; required: false }>();
  return <output>{calendar.selected?.toLocaleDateString()}</output>;
}
```

## Documentation and support

[Guides and examples](https://github.com/unstyled-solid/solid-day-picker/tree/main/docs)
· [Issues and questions](https://github.com/unstyled-solid/solid-day-picker/issues)
· [Contributing](https://github.com/unstyled-solid/solid-day-picker/blob/main/CONTRIBUTING.md)

## License

MIT. Based on [React DayPicker](https://github.com/gpbl/react-day-picker) by
Giampaolo Bellavite and contributors at
[`1bfd4f0`](https://github.com/gpbl/react-day-picker/tree/1bfd4f0776d66f2242b6b32a1f084ab94e2702da).
Original license and attribution are included in `LICENSE` and `NOTICE`.
