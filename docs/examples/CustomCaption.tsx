import {
  DayPicker,
  type MonthCaptionProps,
  useDayPicker,
} from "@solid-unstyled/daypicker";
import { format } from "date-fns";

function CustomMonthCaption(props: MonthCaptionProps) {
  const context191 = useDayPicker();
  return (
    <>
      <h2>{format(props.calendarMonth.date, "MMM yyy")}</h2>
      <div style={{ display: "flex", "justify-content": "space-between" }}>
        <button
          type="button"
          style={{ all: "revert", cursor: "pointer" }}
          disabled={!context191.previousMonth}
          onClick={() => context191.previousMonth && context191.goToMonth(context191.previousMonth)}
        >
          Previous
        </button>
        <button
          type="button"
          style={{ all: "revert", cursor: "pointer" }}
          disabled={!context191.nextMonth}
          onClick={() => context191.nextMonth && context191.goToMonth(context191.nextMonth)}
        >
          Next
        </button>
      </div>
    </>
  );
}

export function CustomCaption() {
  return (
    <DayPicker
      hideNavigation
      components={{
        MonthCaption: CustomMonthCaption,
      }}
    />
  );
}
