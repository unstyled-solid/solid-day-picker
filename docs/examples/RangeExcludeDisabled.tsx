import { DayPicker } from "@solid-unstyled/daypicker";

export function RangeExcludeDisabled() {
  return (
    <DayPicker mode="range" disabled={{ dayOfWeek: [0, 6] }} excludeDisabled />
  );
}
