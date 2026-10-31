import { type DateRange, DayPicker } from "@solid-unstyled/daypicker";
import { format } from "date-fns";
import { createSignal } from "solid-js";

export function RangeMinMax() {
  const [range, setRange] = createSignal<DateRange | undefined | undefined>(undefined);

  const footer=()=>{let footer = `Please pick the first day.`;
    if (range()?.from) {
        if (!range()!.to) {
          footer = `${format(range()!.from!, "PPP")}—`;
        } else if (range()!.to) {
          footer = `${format(range()!.from!, "PPP")}—${format(range()!.to!, "PPP")}`;
        }
      }
    return footer;};
  return (
    <div>
      <p>Select up to 6 nights.</p>
      <DayPicker
        mode="range"
        min={1}
        max={6}
        selected={range()}
        onSelect={setRange}
        footer={footer()}
      />
    </div>
  );
}
