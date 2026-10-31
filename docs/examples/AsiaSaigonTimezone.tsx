import { DayPicker, TZDate } from "@solid-unstyled/daypicker";

export function AsiaSaigonTimezone() {
  const timeZone = "Asia/Saigon";

  return (
    <DayPicker
      defaultMonth={new TZDate(1900, 11, 1, timeZone)}
      timeZone={timeZone}
      showOutsideDays
      fixedWeeks
      noonSafe
    />
  );
}
