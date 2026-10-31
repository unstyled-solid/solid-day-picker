import { DayPicker, enUS } from "@solid-unstyled/daypicker/buddhist";

export function BuddhistEn() {
  return (
    <DayPicker showWeekNumber showOutsideDays locale={enUS} numerals="latn" />
  );
}
