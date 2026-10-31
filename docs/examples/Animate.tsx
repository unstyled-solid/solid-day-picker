import { DayPicker } from "@solid-unstyled/daypicker";
import { createSignal } from "solid-js";

export function Animate() {
  const [selected, setSelected] = createSignal<Date | undefined>(undefined);

  return (
    <DayPicker
      mode="single"
      animate
      selected={selected()}
      onSelect={setSelected}
      fixedWeeks
    />
  );
}
