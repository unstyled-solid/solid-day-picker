import { type DateRange, DayPicker } from "@solid-unstyled/daypicker";
import { createSignal } from "solid-js";

export function TestCase2389() {
  const [selectedPeriod, setSelectedPeriod] = createSignal<DateRange | undefined | undefined>(undefined);

  return (
    <DayPicker
      mode="range"
      startMonth={new Date("2024-07-01")}
      endMonth={new Date("2025-07-31")}
      onSelect={setSelectedPeriod}
      selected={selectedPeriod()}
    />
  );
}
