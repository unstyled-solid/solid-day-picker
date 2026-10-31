import { DayPicker } from "@solid-unstyled/daypicker";
import { es } from "@solid-unstyled/daypicker/locale/es";

export function SpanishWeekStartsOn() {
  return <DayPicker locale={es} weekStartsOn={0} />;
}
