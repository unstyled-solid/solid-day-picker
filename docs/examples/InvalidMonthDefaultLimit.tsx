import { DayPicker } from "@solid-unstyled/daypicker";
import { createSignal, untrack } from "solid-js";

export function InvalidMonthDefaultLimit() {
  const [month, setMonth] = createSignal(untrack(() => {
    const date = new Date();
    date.setFullYear(date.getFullYear() + 1);
    return date;
  }));

  return (
    <DayPicker
      month={month()}
      onMonthChange={setMonth}
      captionLayout="dropdown"
    />
  );
}
