import {
  type DateRange,
  DayPicker,
  type OnSelectHandler,
} from "@solid-unstyled/daypicker";
import { format } from "date-fns";
import { createSignal } from "solid-js";

export function RangeResetSelection() {
  const [selected, setSelected] = createSignal<DateRange | undefined>(undefined);

  const handleSelect: OnSelectHandler<DateRange | undefined> = (range) => {
    setSelected(range);
  };

  return (
    <DayPicker
      mode="range"
      selected={selected()}
      onSelect={handleSelect}
      resetOnSelect
      footer={
        <p>
          <span data-testid="from">
            {selected()?.from && format(selected()?.from!, "yyyy-MM-dd")}
          </span>
          <span data-testid="to">
            {selected()?.to && `—${format(selected()?.to!, "yyyy-MM-dd")}`}
          </span>
        </p>
      }
    />
  );
}
