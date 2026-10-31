import { type DateRange, DayPicker } from "@solid-unstyled/daypicker";
import { createSignal } from "solid-js";

export function RangeLongExcludeDisabled() {
  const [range, setRange] = createSignal<DateRange | undefined>({
    from: new Date(100, 0, 1),
    to: new Date(2024, 9, 10),
  });

  return (
    <DayPicker
      id="test"
      mode="range"
      defaultMonth={new Date(2024, 9)}
      selected={range()}
      onSelect={setRange}
      excludeDisabled
      disabled={new Date(2000, 0, 1)}
    />
  );
}
