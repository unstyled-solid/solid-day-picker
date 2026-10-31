import { DayPicker, type PropsSingle } from "@solid-unstyled/daypicker";
import { subDays } from "date-fns";

export function ModifiersSelected() {
  const yesterday = subDays(new Date(), 1);
  const handleSelect: PropsSingle["onSelect"] = (_value, _date, modifiers) => {
    if (modifiers.selected) {
      alert("You clicked a selected day.");
    }
    if (modifiers.today) {
      alert("You clicked today");
    }
  };
  return (
    <DayPicker mode="single" selected={yesterday} onSelect={handleSelect} />
  );
}
