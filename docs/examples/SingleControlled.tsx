import { DayPicker } from "@solid-unstyled/daypicker";
import { createSignal } from "solid-js";

export function SingleControlled() {
  const [selected, setSelected] = createSignal<Date | undefined | undefined>(undefined);
  return <DayPicker mode="single" onSelect={setSelected} selected={selected()} />;
}
