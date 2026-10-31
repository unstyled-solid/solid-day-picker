
import type { DateLib } from "../classes/DateLib.js";
import { useControlledValue } from "../helpers/useControlledValue.js";
import type {
  DayPickerProps,
  Modifiers,
  PropsRange,
  Selection,
} from "../types/index.js";
import { addToRange, rangeContainsModifiers } from "../utils/index.js";
import { rangeIncludesDate } from "../utils/rangeIncludesDate.js";
import { live } from "../live.js";

/**
 * Hook to manage range selection in the DayPicker component.
 *
 * @template T - The type of DayPicker props.
 * @param props - The DayPicker props.
 * @param dateLib - The date utility library instance.
 * @returns An object containing the selected range, a function to select a
 *   range, and a function to check if a date is within the range.
 */
export function useRange<T extends DayPickerProps>(
  props: T,
  dateLib: DateLib,
): Selection<T> {
  const localProps = props as PropsRange;

  const [internallySelected, setSelected] = useControlledValue(
    localProps.selected,
    () => localProps.onSelect ? localProps.selected : undefined,
  );

  const selected = () => !localProps.onSelect ? internallySelected() : localProps.selected;

  const isSelected = (date: Date) => {
    const current = selected();
    return current && rangeIncludesDate(current, date, false, dateLib);
  };

  const select = (
    triggerDate: Date,
    modifiers: Modifiers,
    e: MouseEvent | KeyboardEvent,
  ) => {
    const localProps = props as PropsRange;
    let newRange: ReturnType<typeof addToRange>;
    if (triggerDate) {
      const selectedFrom = selected()?.from;
      const selectedTo = selected()?.to;
      const hasFullRange = !!selectedFrom && !!selectedTo;
      const isClickingSingleDayRange =
        !!selectedFrom &&
        !!selectedTo &&
        dateLib.isSameDay(selectedFrom, selectedTo) &&
        dateLib.isSameDay(triggerDate, selectedFrom);

      if (localProps.resetOnSelect && (hasFullRange || !selected()?.from)) {
        if (!localProps.required && isClickingSingleDayRange) {
          newRange = undefined;
        } else {
          newRange = { from: triggerDate, to: undefined };
        }
      } else {
        newRange = addToRange(
          triggerDate,
          selected(),
          localProps.min,
          localProps.max,
          localProps.required,
          dateLib,
        );
      }
    }

    if (localProps.excludeDisabled && localProps.disabled && newRange?.from && newRange.to) {
      if (
        rangeContainsModifiers(
          { from: newRange.from, to: newRange.to },
          localProps.disabled,
          dateLib,
        )
      ) {
        // if a disabled days is found, the range is reset
        newRange.from = triggerDate;
        newRange.to = undefined;
      }
    }

    if (!localProps.onSelect) {
      setSelected(newRange);
    }
    localProps.onSelect?.(newRange, triggerDate, modifiers, e);

    return newRange;
  };

  return {
    get selected() { return selected(); },
    select,
    isSelected,
  } as Selection<T>;
}
