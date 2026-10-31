import { type DateRange, DayPicker } from "@solid-unstyled/daypicker";
import { addDays, format, startOfMonth } from "date-fns";
import { createSignal } from "solid-js";

export function RangeRequired() {
  const [range, setRange] = createSignal<DateRange>({
    from: startOfMonth(new Date()),
    to: addDays(startOfMonth(new Date()), 4),
  });

  const footer=()=>{let footer = `Please pick the first day.`;
    if (range()?.from) {
        if (!range().to) {
          footer = `${format(range().from!, "PPP")}—`;
        } else if (range().to) {
          footer = `${format(range().from!, "PPP")}—${format(range().to!, "PPP")}`;
        }
      }
    return footer;};
  return (
    <DayPicker
      mode="range"
      required
      selected={range()}
      onSelect={setRange}
      footer={footer()}
    />
  );
}
