import type {JSX} from "@solidjs/web";
import { type DateRange, DayPicker, type PropsRange } from "@solid-unstyled/daypicker";
import { format, isAfter, isBefore, isValid, parse } from "date-fns";
import { createSignal } from "solid-js";

export function InputRange() {
  const [selectedRange, setSelectedRange] = createSignal<DateRange | undefined>(undefined);
  const [fromValue, setFromValue] = createSignal<string>("");
  const [toValue, setToValue] = createSignal<string>("");

  const handleFromChange: JSX.EventHandler<HTMLInputElement, InputEvent> = (e) => {
    setFromValue(e.currentTarget.value);
    const date = parse(e.currentTarget.value, "y-MM-dd", new Date());
    if (!isValid(date)) {
      return setSelectedRange({ from: undefined, to: undefined });
    }
    if (selectedRange()?.to && isAfter(date, selectedRange()!.to!)) {
      setSelectedRange({ from: selectedRange()!.to, to: date });
    } else {
      setSelectedRange({ from: date, to: selectedRange()?.to });
    }
  };

  const handleToChange: JSX.EventHandler<HTMLInputElement, InputEvent> = (e) => {
    setToValue(e.currentTarget.value);
    const date = parse(e.currentTarget.value, "y-MM-dd", new Date());

    if (!isValid(date)) {
      return setSelectedRange({ from: selectedRange()?.from, to: undefined });
    }
    if (selectedRange()?.from && isBefore(date, selectedRange()!.from!)) {
      setSelectedRange({ from: date, to: selectedRange()!.from });
    } else {
      setSelectedRange({ from: selectedRange()?.from, to: date });
    }
  };

  const handleRangeSelect: PropsRange["onSelect"] = (range) => {
    setSelectedRange(range);
    if (range?.from) {
      setFromValue(format(range.from, "y-MM-dd"));
    } else {
      setFromValue("");
    }
    if (range?.to) {
      setToValue(format(range.to, "y-MM-dd"));
    } else {
      setToValue("");
    }
  };

  return (
    <div>
      <DayPicker
        mode="range"
        selected={selectedRange()}
        onSelect={handleRangeSelect}
      />
      <form class="ma2">
        <input
          size={10}
          placeholder="From Date"
          value={fromValue()}
          onInput={handleFromChange}
        />
        {" – "}
        <input
          size={10}
          placeholder="To Date"
          value={toValue()}
          onInput={handleToChange}
        />
      </form>
    </div>
  );
}
