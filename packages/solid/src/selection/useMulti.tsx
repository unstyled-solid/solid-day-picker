
import type { DateLib } from "../classes/DateLib.js";
import { useControlledValue } from "../helpers/useControlledValue.js";
import type {
  DayPickerProps,
  Modifiers,
  PropsMulti,
  Selection,
} from "../types/index.js";
import { live } from "../live.js";

/**
 * Hook to manage multiple-date selection in the DayPicker component.
 *
 * @template T - The type of DayPicker props.
 * @param props - The DayPicker props.
 * @param dateLib - The date utility library instance.
 * @returns An object containing the selected dates, a function to select dates,
 *   and a function to check if a date is selected.
 */
export function useMulti<T extends DayPickerProps>(
  props: T,
  dateLib: DateLib,
): Selection<T> {
  const localProps = props as PropsMulti;

  const [internallySelected, setSelected] = useControlledValue(
    localProps.selected,
    () => localProps.onSelect ? localProps.selected : undefined,
  );

  const selected = () => !localProps.onSelect ? internallySelected() : localProps.selected;

  const isSameDay = (a: Date, b: Date) => dateLib.isSameDay(a, b);

  const isSelected = (date: Date) => {
    return selected()?.some((d) => isSameDay(d, date)) ?? false;
  };

  const select = (
    triggerDate: Date,
    modifiers: Modifiers,
    e: MouseEvent | KeyboardEvent,
  ) => {
    let newDates: Date[] | undefined = [...(selected() ?? [])];
    if (isSelected(triggerDate)) {
      if (selected()?.length === localProps.min) {
        // Min value reached, do nothing
        return;
      }
      if (localProps.required && selected()?.length === 1) {
        // Required value already selected do nothing
        return;
      }
      newDates = selected()?.filter((d) => !isSameDay(d, triggerDate));
    } else {
      if (selected()?.length === localProps.max) {
        // Max value reached, reset the selection to date
        newDates = [triggerDate];
      } else {
        // Add the date to the selection
        newDates = [...newDates, triggerDate];
      }
    }
    if (!localProps.onSelect) {
      setSelected(newDates);
    }
    localProps.onSelect?.(newDates, triggerDate, modifiers, e);
    return newDates;
  };

  return {
    get selected() { return selected(); },
    select,
    isSelected,
  } as Selection<T>;
}
