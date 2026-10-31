import { DayPicker } from "@solid-unstyled/daypicker/ethiopic";
import { type ComponentProps } from "@solidjs/web";

export function Ethiopic(props: ComponentProps<typeof DayPicker>) {
  return <DayPicker {...props} />;
}
