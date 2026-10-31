import { type DateRange, DayPicker } from "@solid-unstyled/daypicker";
import { createSignal } from "solid-js";

/**
 * Test case for issue #1567
 *
 * @see https://github.com/gpbl/react-day-picker/issues/1567
 */
export function TestCase1567() {
  const [selected, setSelected] = createSignal<DateRange | undefined>({
    from: new Date(2022, 8, 25),
    to: new Date(2022, 9, 1),
  });

  const handleChange = (range: DateRange | undefined) => {
    if (range) setSelected(range);
  };
  return (
    <div class="App">
      <DayPicker
        mode="range"
        onSelect={handleChange}
        numberOfMonths={2}
        showOutsideDays
        selected={selected()}
        startMonth={new Date(2020, 5)}
      />
      <button type="button">I should be focusable</button>
    </div>
  );
}
