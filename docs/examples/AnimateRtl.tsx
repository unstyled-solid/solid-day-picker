import { DayPicker } from "@solid-unstyled/daypicker";
import classNames from "@solid-unstyled/daypicker/style.module.css";
import { ar } from "date-fns/locale";
import { createSignal } from "solid-js";

export function AnimateRtl() {
  const [selected, setSelected] = createSignal<Date | undefined>(undefined);

  return (
    <DayPicker
      mode="single"
      locale={ar}
      animate
      dir="rtl"
      selected={selected()}
      onSelect={setSelected}
      classNames={classNames}
    />
  );
}
