import { type DayEventHandler, DayPicker } from "@solid-unstyled/daypicker";
import { isSameDay } from "date-fns";
import { createSignal } from "solid-js";

export function CustomMultiple() {
  const [value, setValue] = createSignal<Date[]>([]);

  const handleDayClick: DayEventHandler<MouseEvent> = (
    day,
    modifiers,
  ) => {
    const newValue = [...value()];
    if (modifiers.selected) {
      const index = value().findIndex((d) => isSameDay(day, d));
      newValue.splice(index, 1);
    } else {
      newValue.push(day);
    }
    setValue(newValue);
  };

  const handleResetClick = () => setValue([]);

  const footer=()=>{let footer = <>Please pick one or more days.</>;
    if (value().length > 0)
        footer = (
          <>
            You selected {value().length} days.{" "}
            <button type="button" onClick={handleResetClick}>
              Reset
            </button>
          </>
        );
    return footer;};
  return (
    <DayPicker
      onDayClick={handleDayClick}
      modifiers={{ selected: value() }}
      footer={footer()}
    />
  );
}
