import { DayPicker } from "@solid-unstyled/daypicker";
import { createSignal } from "solid-js";

export function Start() {
  const [selected, setSelected] = createSignal<Date | undefined>(undefined);

  return (
    <DayPicker
      animate
      mode="single"
      selected={selected()}
      onSelect={setSelected}
      footer={
        selected() ? `Selected: ${selected()!.toLocaleDateString()}` : "Pick a day."
      }
    />
  );
}
