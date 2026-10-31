
import type {
  CalendarDay,
  CalendarMonth,
  CalendarWeek,
  DateLib,
} from "./classes/index.js";
import { getDates } from "./helpers/getDates.js";
import { getDays } from "./helpers/getDays.js";
import { getDisplayMonths } from "./helpers/getDisplayMonths.js";
import { getInitialMonth } from "./helpers/getInitialMonth.js";
import { getMonths } from "./helpers/getMonths.js";
import { getNavMonths } from "./helpers/getNavMonth.js";
import { getNextMonth } from "./helpers/getNextMonth.js";
import { getPreviousMonth } from "./helpers/getPreviousMonth.js";
import { getWeeks } from "./helpers/getWeeks.js";
import { useControlledValue } from "./helpers/useControlledValue.js";
import type { DayPickerProps } from "./types/props.js";
import { createMemo, createEffect } from "solid-js";
import { live } from "./live.js";

/**
 * Returns the calendar object used by DayPicker custom components.
 *
 * @see https://daypicker.dev/guides/custom-components
 */
export interface Calendar {
  /**
   * All the days displayed in the calendar. Unlike
   * {@link CalendarContext.dates}, it may contain duplicated dates when shown
   * outside the month.
   */
  days: CalendarDay[];
  /** The weeks displayed in the calendar. */
  weeks: CalendarWeek[];
  /** The months displayed in the calendar. */
  months: CalendarMonth[];

  /** The next month to display. */
  nextMonth: Date | undefined;
  /** The previous month to display. */
  previousMonth: Date | undefined;

  /**
   * The month where the navigation starts. `undefined` if the calendar can be
   * navigated indefinitely to the past.
   */
  navStart: Date | undefined;
  /**
   * The month where the navigation ends. `undefined` if the calendar can be
   * navigated indefinitely to the future.
   */
  navEnd: Date | undefined;

  /** Navigate to the specified month. Will fire the `onMonthChange` callback. */
  goToMonth: (month: Date) => void;
  /**
   * Navigate to the month containing the specified day when it falls outside
   * the currently displayed calendar.
   *
   * @param day - The date to navigate to.
   */
  goToDay: (day: CalendarDay) => void;
}

/**
 * Provides the calendar object to work with the calendar in custom components.
 *
 * @private
 * @param props - The DayPicker props related to calendar configuration.
 * @param dateLib - The date utility library instance.
 * @returns The calendar object containing displayed days, weeks, months, and
 *   navigation methods.
 */
export function useCalendar(
  props: Pick<
    DayPickerProps,
    | "captionLayout"
    | "endMonth"
    | "startMonth"
    | "today"
    | "fixedWeeks"
    | "ISOWeek"
    | "numberOfMonths"
    | "pagedNavigation"
    | "reverseMonths"
    | "disableNavigation"
    | "onMonthChange"
    | "month"
    | "defaultMonth"
    | "timeZone"
    | "broadcastCalendar"
  >,
  dateLib: DateLib,
): Calendar {
  const navBounds = createMemo(() => getNavMonths(props, dateLib));

  const dateMethods = dateLib;
  const initialMonth = getInitialMonth(props, navBounds()[0], navBounds()[1], dateLib);
  const [firstMonth, setFirstMonth] = useControlledValue(
    initialMonth,
    // initialMonth is always computed from props.month if provided
    () => props.month ? getInitialMonth(props, navBounds()[0], navBounds()[1], dateLib) : undefined,
  );

  // biome-ignore lint/correctness/useExhaustiveDependencies: change the initial month when the time zone changes.
  createEffect(() => props.timeZone, () => {
    setFirstMonth(getInitialMonth(props, navBounds()[0], navBounds()[1], dateLib));
  });

  const display = live(createMemo(() => {
    const displayMonths = getDisplayMonths(
      firstMonth(),
      navBounds()[1],
      { numberOfMonths: props.numberOfMonths },
      dateLib,
    );

    const dates = getDates(
      displayMonths,
      props.endMonth ? dateMethods.endOfMonth(props.endMonth) : undefined,
      {
        ISOWeek: props.ISOWeek,
        fixedWeeks: props.fixedWeeks,
        broadcastCalendar: props.broadcastCalendar,
      },
      dateLib,
    );

    const months = getMonths(
      displayMonths,
      dates,
      {
        broadcastCalendar: props.broadcastCalendar,
        fixedWeeks: props.fixedWeeks,
        ISOWeek: props.ISOWeek,
        reverseMonths: props.reverseMonths,
      },
      dateLib,
    );

    const weeks = getWeeks(months);
    const days = getDays(months);

    const previousMonth = getPreviousMonth(
      firstMonth(),
      navBounds()[0],
      props,
      dateLib,
    );
    const nextMonth = getNextMonth(firstMonth(), navBounds()[1], props, dateLib);

    return {
      months,
      weeks,
      days,
      previousMonth,
      nextMonth,
    };
  }));

  const localProps = props;

  const isDayInCalendar = (day: CalendarDay) =>
    display.weeks.some((week: CalendarWeek) => week.days.some((d) => d.isEqualTo(day)));

  const goToMonth = (date: Date) => {
    if (localProps.disableNavigation) {
      return;
    }
    let newMonth = dateMethods.startOfMonth(date);
    const [navStart, navEnd] = navBounds();
    // if month is before start, use the first month instead
    if (navStart && newMonth < dateMethods.startOfMonth(navStart)) {
      newMonth = dateMethods.startOfMonth(navStart);
    }
    // if month is after endMonth, use the last month instead
    if (navEnd && newMonth > dateMethods.startOfMonth(navEnd)) {
      newMonth = dateMethods.startOfMonth(navEnd);
    }
    setFirstMonth(newMonth);
    localProps.onMonthChange?.(newMonth);
  };

  const goToDay = (day: CalendarDay) => {
    // is this check necessary?
    if (isDayInCalendar(day)) {
      return;
    }
    goToMonth(day.date);
  };

  const calendar = {
    get months() { return display.months; },
    get weeks() { return display.weeks; },
    get days() { return display.days; },

    get navStart() { return navBounds()[0]; },
    get navEnd() { return navBounds()[1]; },

    get previousMonth() { return display.previousMonth; },
    get nextMonth() { return display.nextMonth; },

    goToMonth,
    goToDay,
  };

  return calendar;
}
