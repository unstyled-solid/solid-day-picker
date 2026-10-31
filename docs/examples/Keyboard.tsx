import {
  DayPicker,
  type DayPickerProps,
  type PropsSingle,
} from "@solid-unstyled/daypicker";
import { createSignal } from "solid-js";

export function Keyboard(props: DayPickerProps & PropsSingle) {
  const [selected, setSelected] = createSignal<Date | undefined>(undefined);
  return (
    <DayPicker
      {...props}
      selected={selected()}
      onSelect={setSelected}
      mode="single"
      today={new Date(2022, 5, 10)}
    />
  );
}
