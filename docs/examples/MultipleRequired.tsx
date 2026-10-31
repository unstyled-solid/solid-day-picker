import { DayPicker } from "@solid-unstyled/daypicker";

export function MultipleRequired() {
  return <DayPicker mode="multiple" required selected={[new Date()]} />;
}
