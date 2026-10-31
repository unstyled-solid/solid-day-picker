import { DayPicker } from "@solid-unstyled/daypicker";

export function PastDatesDisabled() {
  return <DayPicker mode="single" disabled={{ before: new Date() }} />;
}
