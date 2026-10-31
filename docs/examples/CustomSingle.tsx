import { DayPicker, type DayPickerProps } from "@solid-unstyled/daypicker";
import { createSignal } from "solid-js";

export function CustomSingle() {
  const [selectedDate, setSelectedDate] = createSignal<Date | undefined | undefined>(undefined);
  const modifiers = (): DayPickerProps["modifiers"] => {
    const value:DayPickerProps['modifiers']={};
    if(selectedDate())value.selected=selectedDate();
    return value;
  };
  return (
    <DayPicker
      modifiers={modifiers()}
      onDayClick={(day, modifiers) => {
        if (modifiers.selected) {
          setSelectedDate(undefined);
        } else {
          setSelectedDate(day);
        }
      }}
      footer={selectedDate() && `You selected ${selectedDate()!.toDateString()}`}
    />
  );
}
