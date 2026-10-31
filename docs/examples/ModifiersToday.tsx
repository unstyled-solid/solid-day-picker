import { type DayEventHandler, DayPicker } from "@solid-unstyled/daypicker";
import { createSignal } from "solid-js";

export function ModifiersToday() {
  const initialFooter = "Try clicking the today’s date.";
  const [footer, setFooter] = createSignal(initialFooter);

  const handleDayClick: DayEventHandler<MouseEvent> = (
    _day,
    modifiers,
  ) => {
    if (modifiers.today) {
      setFooter("You clicked the today’s date.");
    } else {
      setFooter("This is not the today’s date.");
    }
  };
  return <DayPicker onDayClick={handleDayClick} footer={footer()} />;
}
