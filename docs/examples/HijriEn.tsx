import { DayPicker, enUS } from "@solid-unstyled/daypicker/hijri";

export function HijriEn() {
  return (
    <DayPicker showWeekNumber showOutsideDays locale={enUS} numerals="latn" />
  );
}
