import { DayPicker } from "@solid-unstyled/daypicker";

export function ModifiersDisabled() {
  return <DayPicker mode="range" disabled={{ dayOfWeek: [0, 6] }} />;
}
