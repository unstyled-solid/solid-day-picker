import { DayPicker } from "@solid-unstyled/daypicker";
const availableDays = [new Date(2021, 5, 23), new Date(2021, 5, 24)];

const availableStyle = {
  "font-weight": 900,
  color: "lightgreen",
};

export function ModifiersStyle() {
  return (
    <DayPicker
      mode="single"
      defaultMonth={availableDays[0]}
      modifiers={{
        available: availableDays,
      }}
      modifiersStyles={{
        available: availableStyle,
      }}
    />
  );
}
