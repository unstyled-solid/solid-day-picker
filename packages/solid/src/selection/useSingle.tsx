
import type { DateLib } from "../classes/DateLib.js";
import { useControlledValue } from "../helpers/useControlledValue.js";
import type {
  DayPickerProps,
  Modifiers,
  PropsSingle,
  SelectedValue,
  SelectHandler,
  Selection,
} from "../types/index.js";
import { live } from "../live.js";
import { untrack } from "solid-js";

export type UseSingle<T extends DayPickerProps> = {
  select: SelectHandler<T>;
  isSelected: (date: Date) => boolean;
  selected: SelectedValue<T>;
};

/**
 * Hook to manage single-date selection in the DayPicker component.
 *
 * @template T - The type of DayPicker props.
 * @param props - The DayPicker props.
 * @param dateLib - The date utility library instance.
 * @returns An object containing the selected date, a function to select a date,
 *   and a function to check if a date is selected.
 */
export function useSingle<T extends DayPickerProps>(
  props: DayPickerProps,
  dateLib: DateLib,
): Selection<T> {
  const localProps = props as PropsSingle;

  const [internallySelected, setSelected] = useControlledValue(
    untrack(() => localProps.selected),
    () => localProps.onSelect ? localProps.selected : undefined,
  );

  const selected = () => !localProps.onSelect ? internallySelected() : localProps.selected;

  const isSameDay = (a: Date, b: Date) => dateLib.isSameDay(a, b);

  const isSelected = (compareDate: Date) => {
    const current = selected();
    return current ? isSameDay(current, compareDate) : false;
  };

  const select = (
    triggerDate: Date,
    modifiers: Modifiers,
    e: MouseEvent | KeyboardEvent,
  ) => {
    let newDate: Date | undefined = triggerDate;
    const current = selected();
    if (!localProps.required && current && isSameDay(triggerDate, current)) {
      // If the date is the same, clear the selection.
      newDate = undefined;
    }
    if (!localProps.onSelect) {
      setSelected(newDate);
    }
    if (localProps.required) {
      localProps.onSelect?.(newDate as Date, triggerDate, modifiers, e);
    } else {
      localProps.onSelect?.(newDate, triggerDate, modifiers, e);
    }
    return newDate;
  };

  return {
    get selected() { return selected(); },
    select,
    isSelected,
  } as Selection<T>;
}
