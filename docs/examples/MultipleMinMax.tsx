import { DayPicker } from "@solid-unstyled/daypicker";
import { addDays } from "date-fns";

export function MultipleMinMax() {
  const selected = [new Date(), addDays(new Date(), 1)];
  return <DayPicker selected={selected} mode="multiple" min={2} max={5} />;
}
