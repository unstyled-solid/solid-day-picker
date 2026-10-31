import { DayPicker } from "@solid-unstyled/daypicker";
import { format, isValid, parse } from "date-fns";
import { createSignal, createUniqueId } from "solid-js";

/** Render an input field bound to a DayPicker calendar. */
export function Input() {
  const inputId = createUniqueId();

  // Hold the month in state to control the calendar when the input changes
  const [month, setMonth] = createSignal(new Date());

  // Hold the selected date in state
  const [selectedDate, setSelectedDate] = createSignal<Date | undefined>(undefined);

  // Hold the input value in state
  const [inputValue, setInputValue] = createSignal("");

  /**
   * Function to handle the DayPicker select event: update the input value and
   * the selected date, and set the month.
   */
  const handleDayPickerSelect = (date: Date | undefined) => {
    if (!date) {
      setInputValue("");
      setSelectedDate(undefined);
    } else {
      setSelectedDate(date);
      setMonth(date);
      setInputValue(format(date, "MM/dd/yyyy"));
    }
  };

  /**
   * Handle the input change event: parse the input value to a date, update the
   * selected date and set the month.
   */
  const handleInputChange = (e: Event & { currentTarget: HTMLInputElement; target: HTMLInputElement }) => {
    setInputValue(e.currentTarget.value); // keep the input value in sync

    const parsedDate = parse(e.currentTarget.value, "MM/dd/yyyy", new Date());

    if (isValid(parsedDate)) {
      setSelectedDate(parsedDate);
      setMonth(parsedDate);
    } else {
      setSelectedDate(undefined);
    }
  };

  return (
    <div>
      <label for={inputId}>
        <strong>Date:</strong>
      </label>
      <input
        style={{ "font-size": "inherit", padding: "0.25em 0.5em" }}
        id={inputId}
        type="text"
        value={inputValue()}
        placeholder="MM/dd/yyyy"
        onInput={handleInputChange}
        onKeyDown={(e) => {
          // Fixes https://github.com/gpbl/react-day-picker/issues/2724 causing search appearing when typing '/'
          e.stopPropagation();
        }}
      />
      <div style={{ "margin-block": "1em" }}>
        <DayPicker
          month={month()}
          onMonthChange={setMonth}
          mode="single"
          selected={selectedDate()}
          onSelect={handleDayPickerSelect}
          footer={`Selected: ${selectedDate()?.toDateString()}`}
        />
      </div>
    </div>
  );
}
