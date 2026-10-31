import { DayPicker, TZDate } from "@solid-unstyled/daypicker";
import { createSignal } from "solid-js";

export function TimeZoneNoonSafeSimple() {
  const timeZone = "Asia/Dubai";
  const [selected, setSelected] = createSignal<Date | undefined>(new TZDate(1900, 11, 1, timeZone));
  const [noonSafeEnabled, setNoonSafeEnabled] = createSignal(true);
  const formatter = new Intl.DateTimeFormat("en-US", {
    dateStyle: "full",
    timeStyle: "short",
    timeZone,
  });

  return (
    <div>
      <button
        aria-pressed={noonSafeEnabled()?'true':'false'}
        onClick={() => setNoonSafeEnabled((current) => !current)}
        type="button"
      >
        {noonSafeEnabled() ? "Disable noonSafe" : "Enable noonSafe"}
      </button>
      <DayPicker
        defaultMonth={new Date(1900, 11, 1)}
        mode="single"
        timeZone={timeZone}
        noonSafe={noonSafeEnabled()}
        selected={selected()}
        onSelect={setSelected}
        footer={
          selected()
            ? `Selected: ${formatter.format(selected())} (${timeZone})`
            : `Pick a day to see it in ${timeZone}`
        }
      />
    </div>
  );
}
