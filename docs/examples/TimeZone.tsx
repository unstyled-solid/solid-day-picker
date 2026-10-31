import { DayPicker, TZDate } from "@solid-unstyled/daypicker";
import { createSignal } from "solid-js";

export function TimeZone() {
  const timeZone = "Pacific/Honolulu";
  const [selected, setSelected] = createSignal<Date | undefined>(TZDate.tz(timeZone));
  return (
    <DayPicker
      mode="single"
      timeZone={timeZone}
      selected={selected()}
      onSelect={setSelected}
      footer={
        selected()
          ? selected()!.toString()
          : `Pick a day to see it is in ${timeZone} time zone.`
      }
    />
  );
}
