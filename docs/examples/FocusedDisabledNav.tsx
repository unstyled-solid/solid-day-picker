import { DayPicker } from "@solid-unstyled/daypicker";
import { addMonths } from "date-fns";

/** Example for bug #2630. */
export function FocusedDisabledNav() {
  return (
    <DayPicker
      mode="single"
      startMonth={addMonths(new Date(), -2)}
      endMonth={new Date()}
    />
  );
}
