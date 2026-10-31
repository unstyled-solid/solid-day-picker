import { DayPicker, enUS } from "@solid-unstyled/daypicker/hebrew";

export function HebrewEn() {
  return <DayPicker locale={enUS} dir="ltr" numerals="latn" />;
}
