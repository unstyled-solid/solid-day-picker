import { DayPicker } from "@solid-unstyled/daypicker";

export function StylingInline() {
  return (
    <DayPicker
      styles={{
        month_caption: { color: "red" },
      }}
    />
  );
}
