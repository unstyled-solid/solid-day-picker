import type {JSX} from "@solidjs/web";
import { DayPicker } from "@solid-unstyled/daypicker";
import { format, setHours, setMinutes } from "date-fns";
import { createSignal, createEffect } from "solid-js";

export function InputTime() {
  const [selected, setSelected] = createSignal<Date | undefined>(undefined);
  const [timeValue, setTimeValue] = createSignal<string>("00:00");

  // Keep the time input in sync when the selected date changes elsewhere.
  createEffect(() => [selected()], () => {
    if (selected()) {
      setTimeValue(format(selected()!, "HH:mm"));
    }
  });

  const handleTimeChange: JSX.EventHandler<HTMLInputElement, InputEvent> = (e) => {
    const time = e.currentTarget.value;
    if (!selected()) {
      // Defer composing a full Date until a day is picked.
      setTimeValue(time);
      return;
    }
    const [hours, minutes] = time.split(":").map((str) => parseInt(str, 10));
    // Compose a new Date using the current day plus the chosen time.
    const newSelectedDate = setHours(setMinutes(selected()!, minutes), hours);
    setSelected(newSelectedDate);
    setTimeValue(time);
  };

  const handleDaySelect = (date: Date | undefined) => {
    if (!timeValue() || !date) {
      setSelected(date);
      return;
    }
    const [hours, minutes] = timeValue()
      .split(":")
      .map((str) => parseInt(str, 10));
    // Apply the time value to the picked day.
    const newDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      hours,
      minutes,
    );
    setSelected(newDate);
  };

  return (
    <div>
      <form style={{ "margin-block-end": "1em" }}>
        <label>
          Set the time:{" "}
          <input type="time" value={timeValue()} onInput={handleTimeChange} />
        </label>
      </form>
      <DayPicker
        mode="single"
        selected={selected()}
        onSelect={handleDaySelect}
        footer={`Selected date: ${selected() ? selected()!.toLocaleString() : "none"}`}
      />
    </div>
  );
}
