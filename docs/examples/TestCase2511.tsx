import { DateLib, DayPicker } from "@solid-unstyled/daypicker";
import { enAU } from "date-fns/locale";

/**
 * Test case for issue #2511
 *
 * @see https://github.com/gpbl/react-day-picker/issues/2511
 */
export function TestCase2511() {
  return (
    <DayPicker
      dateLib={new DateLib({ locale: enAU })}
      mode="single"
      showOutsideDays
    />
  );
}
