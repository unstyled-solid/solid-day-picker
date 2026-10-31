import type {JSX} from "@solidjs/web";
import {
  type DateRange,
  type DayButtonProps,
  DayPicker,
  useDayPicker,
} from "@solid-unstyled/daypicker";
import { isSameDay } from "date-fns";
import { createSignal } from "solid-js";

function DayWithShiftKey(props: DayButtonProps) {
  const calendar = useDayPicker<{ mode: "range" }>();

  const handleClick: JSX.EventHandler<HTMLButtonElement, MouseEvent> = (e) => {
    const requireShiftKey =
      calendar.selected?.from && !isSameDay(props.day.date, calendar.selected.from);

    if (!e.shiftKey && requireShiftKey) {
      return;
    }
    const handler = props.onClick;
    if (typeof handler==='function') handler(e);
    else if (handler) handler[0](handler[1],e);
  };
  return (
    <button {...props} onClick={handleClick}>
      {props.children}
    </button>
  );
}

export function RangeShiftKey() {
  const [range, setRange] = createSignal<DateRange | undefined>({
    from: undefined,
  });

  const footer=()=>{let footer = "Please pick a day.";
    if (range()?.from && !range()?.to) {
        footer = "Press Shift to choose more days.";
      } else if (range()?.to) {
        const formattedFrom = range()!.from?.toDateString();
        const formattedTo = range()!.to!.toDateString();
        footer = `You selected the days between ${formattedFrom} and ${formattedTo}`;
      }
    return footer;};
  return (
    <DayPicker
      components={{
        DayButton: DayWithShiftKey,
      }}
      mode="range"
      selected={range()}
      onSelect={setRange}
      footer={footer()}
    />
  );
}
