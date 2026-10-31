import { DayPicker } from "@solid-unstyled/daypicker";
import { createSignal } from "solid-js";

export function SingleRequired() {
  const [selectedDay, setSelectedDay] = createSignal<Date | undefined>(undefined);

  return (
    <DayPicker
      mode="single"
      required
      selected={selectedDay()}
      onSelect={(date) => date && setSelectedDay(date)}
    />
  );
}
