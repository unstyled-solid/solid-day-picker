import { type DateRange, DayPicker } from "@solid-unstyled/daypicker";
import { addDays, format } from "date-fns";
import { createSignal } from "solid-js";

export function Range() {
  const defaultMonth = new Date(2020, 5, 15);

  const defaultSelected: DateRange = {
    from: defaultMonth,
    to: addDays(defaultMonth, 4),
  };
  const [range, setRange] = createSignal<DateRange | undefined>(defaultSelected);

  const footer=()=>{let footer = `Please pick the first day.`;
    if (range()?.from) {
        if (!range()!.to) {
          footer = format(range()!.from!, "PPP");
        } else if (range()!.to) {
          footer = `${format(range()!.from!, "PPP")}–${format(range()!.to!, "PPP")}`;
        }
      }
    return footer;};
  return (
    <div>
      <DayPicker
        id="test"
        mode="range"
        defaultMonth={defaultMonth}
        selected={range()}
        footer={footer()}
        onSelect={setRange}
      />
      <button type="button" onClick={() => setRange(undefined)}>
        Reset
      </button>
    </div>
  );
}
