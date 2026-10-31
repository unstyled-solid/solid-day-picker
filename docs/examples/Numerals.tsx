import { DayPicker } from "@solid-unstyled/daypicker";
import { hi } from "@solid-unstyled/daypicker/locale/hi";

export function Numerals() {
  return <DayPicker numerals="deva" locale={hi} />;
}
