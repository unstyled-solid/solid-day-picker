import { DayPicker } from "@solid-unstyled/daypicker";
import { createSignal } from "solid-js";

export function InvalidMonth() {
  const [month, setMonth] = createSignal(new Date(2024, 5));
  return (
    <DayPicker
      month={month()}
      onMonthChange={setMonth}
      captionLayout="dropdown"
      startMonth={new Date(2024, 6)}
      endMonth={new Date(2024, 9)}
    />
  );
}
