import { DayPicker } from "@solid-unstyled/daypicker";
import { createSignal } from "solid-js";

export function StartEndMonthsShowOutsideDays() {
  const [selected, setSelected] = createSignal<Date | undefined>(undefined);

  return (
    <DayPicker
      mode="single"
      selected={selected()}
      onSelect={setSelected}
      showOutsideDays={true}
      defaultMonth={new Date(2024, 2)}
      startMonth={new Date(2024, 2, 30)}
      endMonth={new Date(2024, 2, 1)}
      disabled={new Date(2024, 2, 10)}
    />
  );
}
