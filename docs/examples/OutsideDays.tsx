import { DayPicker } from "@solid-unstyled/daypicker";

export function OutsideDays() {
  return <DayPicker showOutsideDays today={new Date(2021, 10, 25)} />;
}
