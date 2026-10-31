import { DayPicker } from "@solid-unstyled/daypicker";
import { createSignal } from "solid-js";

export function Footer() {
  const [selected, setSelected] = createSignal<Date | undefined>(undefined);
  return (
    <DayPicker
      mode="single"
      selected={selected()}
      onSelect={setSelected}
      footer={
        selected()
          ? `You picked ${selected()!.toLocaleDateString()}.`
          : "Please pick a date."
      }
    />
  );
}
