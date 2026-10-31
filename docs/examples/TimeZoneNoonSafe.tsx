import {
  DayPicker,
  type DayPickerProps,
  type PropsBase,
  type PropsSingle,
  TZDate,
} from "@solid-unstyled/daypicker";
import { createSignal, omit } from "solid-js";

type TimeZoneNoonSafeProps = Omit<PropsBase, "mode"> & {
  selected?: Date;
  onSelect?: PropsSingle["onSelect"];
};

export function TimeZoneNoonSafe(props: TimeZoneNoonSafeProps = {}) {
  const context316 = props; const rest = omit(context316, "timeZone", "weekStartsOn", "selected", "onSelect", "defaultMonth", "startMonth", "footer");

  const timeZone = () => (context316.timeZone ?? "Asia/Dubai");
  const weekStartsOn = () => ((context316.weekStartsOn ??
    1) as DayPickerProps["weekStartsOn"]);
  const [selected, setSelected] = createSignal<Date | undefined>(context316.selected ?? new TZDate(1900, 11, 1, timeZone()));
  const onSelect: () => PropsSingle["onSelect"] = () => (context316.onSelect ??
    ((nextSelected: Date | undefined) => {
      setSelected(nextSelected ?? undefined);
    }));
  const selectedValue = () => (context316.selected ?? selected());

  return (
    <DayPicker
      mode="single"
      captionLayout="dropdown"
      defaultMonth={context316.defaultMonth ?? new TZDate(1900, 11, 1, timeZone())}
      timeZone={timeZone()}
      noonSafe
      weekStartsOn={weekStartsOn()}
      showOutsideDays={rest.showOutsideDays ?? true}
      fixedWeeks={rest.fixedWeeks ?? true}
      selected={selectedValue()}
      onSelect={onSelect()}
      startMonth={context316.startMonth ?? new Date(1880, 0, 1)}
      endMonth={new Date(2025, 11, 31)}
      footer={
        context316.footer ??
        (selected()
          ? selected()!.toString()
          : `Pick a day to see it in ${timeZone()} time zone.`)
      }
      {...rest}
    />
  );
}
