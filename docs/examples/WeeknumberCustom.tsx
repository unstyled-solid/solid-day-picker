import { DayPicker, type WeekNumberProps } from "@solid-unstyled/daypicker";
import { addMonths } from "date-fns";
import { omit } from "solid-js";

const today = new Date(2021, 0, 1);

function WeekNumber(componentProps: WeekNumberProps) {
  const props = omit(componentProps, "week");
  return (
    <th {...props}>
      <button type="button" onClick={() => console.log(componentProps.week)}>
        {props.children}
      </button>
    </th>
  );
}

export function WeeknumberCustom() {
  return (
    <DayPicker
      showWeekNumber
      defaultMonth={addMonths(today, -1)}
      components={{
        WeekNumber,
      }}
      labels={{
        labelWeekNumber: (weekNumber: number) => `W${weekNumber}`,
      }}
      formatters={{
        formatWeekNumber: (weekNumber: number) => `W${weekNumber}`,
      }}
    />
  );
}
