import { DayPicker } from "@solid-unstyled/daypicker";
import { addMonths, isSameMonth } from "date-fns";
import { createSignal } from "solid-js";

export function Controlled() {
  const today = new Date();
  const nextMonth = addMonths(new Date(), 1);
  const [month, setMonth] = createSignal<Date>(nextMonth);

  return (
    <div>
      <DayPicker month={month()} onMonthChange={setMonth} />
      <button
        type="button"
        style={{ all: "unset", cursor: "pointer", color: "blue" }}
        disabled={isSameMonth(today, month())}
        onClick={() => setMonth(today)}
      >
        Go to Today
      </button>
    </div>
  );
}
