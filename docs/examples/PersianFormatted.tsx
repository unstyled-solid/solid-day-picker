import { DayPicker, faIR, getDateLib } from "@solid-unstyled/daypicker/persian";
import { createSignal } from "solid-js";

export function PersianFormatted() {
  const [selected, setSelected] = createSignal(new Date());
  const dateLib = getDateLib({
    locale: faIR,
    numerals: "arabext",
  });
  return (
    <DayPicker
      mode="single"
      selected={selected()}
      required
      onSelect={setSelected}
      footer={`انتخاب شده: ${dateLib.format(selected(), "yyyy/MM/dd")}`}
    />
  );
}
