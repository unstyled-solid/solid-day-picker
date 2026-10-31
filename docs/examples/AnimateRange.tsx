import { type DateRange, DayPicker } from "@solid-unstyled/daypicker";
import { createSignal } from "solid-js";

export function AnimateRange() {
  const [selected, setSelected] = createSignal<DateRange | undefined>(undefined);

  return (
    <DayPicker
      mode="range"
      animate
      selected={selected()}
      onSelect={setSelected}
      numberOfMonths={6}
    />
  );
}
