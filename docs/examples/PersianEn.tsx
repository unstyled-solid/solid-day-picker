import { DayPicker, enUS } from "@solid-unstyled/daypicker/persian";

export function PersianEn() {
  return (
    <DayPicker showWeekNumber showOutsideDays locale={enUS} numerals="latn" />
  );
}
