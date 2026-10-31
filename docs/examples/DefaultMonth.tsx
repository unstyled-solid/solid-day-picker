import { DayPicker } from "@solid-unstyled/daypicker";

export function DefaultMonth() {
  return <DayPicker defaultMonth={new Date(1979, 8)} />;
}
