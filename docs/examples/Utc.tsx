import { DayPicker, TZDate } from "@solid-unstyled/daypicker";
import { createSignal } from "solid-js";

export function Utc() {
  const [selected, setSelected] = createSignal<Date>(TZDate.tz("UTC"));
  return (
    <DayPicker
      mode="single"
      required
      selected={selected()}
      onSelect={(date: Date) => {
        setSelected(date);
      }}
      footer={selected() ? `${selected().toUTCString()}` : null}
    />
  );
}
