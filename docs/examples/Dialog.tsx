import { DayPicker } from "@solid-unstyled/daypicker";
import { format, isValid, parse } from "date-fns";
import { createSignal, createEffect, createUniqueId } from "solid-js";

export function Dialog() {
  const dialogRef = { current: null as HTMLDialogElement | null };
  const dialogId = createUniqueId();
  const headerId = createUniqueId();

  // Hold the month in state to control the calendar when the input changes
  const [month, setMonth] = createSignal(new Date());

  // Hold the selected date in state
  const [selectedDate, setSelectedDate] = createSignal<Date | undefined>(undefined);

  // Hold the input value in state
  const [inputValue, setInputValue] = createSignal("");

  // Hold the dialog visibility in state
  const [isDialogOpen, setIsDialogOpen] = createSignal(false);

  // Function to toggle the dialog visibility
  const toggleDialog = () => setIsDialogOpen(!isDialogOpen());
  const calendarLabel = () => (`Calendar, ${format(month(), "MMMM yyyy")}`);

  // Hook to handle the body scroll behavior and focus trapping. You may want to
  // use your own trapping library as the body.style overflow will break the
  // scroll position.
  createEffect(() => [isDialogOpen()], () => {
    if (!dialogRef.current) return;
    if (isDialogOpen()) {
      dialogRef.current.showModal();
    } else {
      dialogRef.current.close();
    }
  });

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
      setInputValue(format(date, "MM/dd/yyyy"));
    }
    dialogRef.current?.close();
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
      <label for="date-input">
        <strong>Pick a Date: </strong>
      </label>
      <input
        style={{ "font-size": "inherit" }}
        id="date-input"
        type="text"
        value={inputValue()}
        placeholder={"MM/dd/yyyy"}
        onInput={handleInputChange}
      />{" "}
      <button
        type="button"
        style={{ "font-size": "inherit" }}
        onClick={toggleDialog}
        aria-controls={dialogId}
        aria-haspopup="dialog"
        aria-expanded={isDialogOpen()?'true':'false'}
        aria-label="Open calendar to choose booking date"
      >
        📆
      </button>
      <p aria-live="assertive" aria-atomic="true">
        {selectedDate() !== undefined
          ? selectedDate()!.toDateString()
          : "Please type or pick a date"}
      </p>
      <dialog
        ref={node => { dialogRef.current = node; }}
        id={dialogId}
        aria-modal="true"
        aria-labelledby={headerId}
        onClose={() => setIsDialogOpen(false)}
      >
        {isDialogOpen() && (
          <>
            <h2 id={headerId}>Choose a date</h2>
            <DayPicker
              defaultMonth={selectedDate() || month()}
              onMonthChange={setMonth}
              autoFocus
              role="application"
              aria-label={calendarLabel()}
              mode="single"
              selected={selectedDate()}
              onSelect={handleDayPickerSelect}
              footer={
                selectedDate() !== undefined && (
                  <>Selected: {selectedDate()!.toDateString()}</>
                )
              }
            />
          </>
        )}
      </dialog>
    </div>
  );
}
