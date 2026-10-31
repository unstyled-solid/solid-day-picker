import { DayPicker } from "@solid-unstyled/daypicker";
import { arSA } from "@solid-unstyled/daypicker/locale/ar-SA";

export function Rtl() {
  return <DayPicker dir="rtl" locale={arSA} />;
}
