import type { JSX } from "@solidjs/web";
import { renderHook } from "@/test/render";
import type { CalendarDay } from "./classes/CalendarDay";
import { CalendarMonth } from "./classes/CalendarMonth";
import type { DayPickerProps } from "./types/props";
import type { Modifiers } from "./types/shared";
import { Animation, DayFlag, SelectionState, UI } from "./UI";
import {
  type DayPickerContext,
  dayPickerContext as DayPickerProvider,
  useDayPicker,
} from "./useDayPicker";
import { type Component } from "solid-js";

describe("useDayPicker", () => {
  const displayedMonth = new Date(2024, 0, 1);
  const previousMonth = new Date(2023, 11, 1);
  const nextMonth = new Date(2024, 1, 1);
  const selectedDate = new Date(2024, 0, 15);

  type SingleDayPickerContext = DayPickerContext<{
    required: false;
    mode: "single";
  }>;

  let mockContextValue: SingleDayPickerContext;
  let wrapper: Component<{ children: JSX.Element }>;
  let context: SingleDayPickerContext;

  function createMockContextValue(): SingleDayPickerContext {
    return {
      months: [new CalendarMonth(displayedMonth, [])],
      nextMonth,
      previousMonth,
      goToMonth: vi.fn(),
      getModifiers: vi.fn((_day: CalendarDay) => ({}) as Modifiers),
      selected: selectedDate,
      select: vi.fn(),
      isSelected: vi.fn((_date: Date) => false),
      components: {
        Chevron: vi.fn(),
        CaptionLabel: vi.fn(),
        Day: vi.fn(),
        DayButton: vi.fn(),
        Dropdown: vi.fn(),
        DropdownNav: vi.fn(),
        Footer: vi.fn(),
        Month: vi.fn(),
        MonthCaption: vi.fn(),
        MonthGrid: vi.fn(),
        Months: vi.fn(),
        Nav: vi.fn(),
        Option: vi.fn(),
        PreviousMonthButton: vi.fn(),
        NextMonthButton: vi.fn(),
        Root: vi.fn(),
        Select: vi.fn(),
        Weeks: vi.fn(),
        Week: vi.fn(),
        Weekday: vi.fn(),
        Weekdays: vi.fn(),
        WeekNumber: vi.fn(),
        WeekNumberHeader: vi.fn(),
        MonthsDropdown: vi.fn(),
        YearsDropdown: vi.fn(),
      },
      classNames: {
        [UI.Root]: "",
        [UI.Chevron]: "",
        [UI.Day]: "",
        [UI.DayButton]: "",
        [UI.CaptionLabel]: "",
        [UI.Dropdowns]: "",
        [UI.Dropdown]: "",
        [UI.DropdownRoot]: "",
        [UI.Footer]: "",
        [UI.MonthGrid]: "",
        [UI.MonthCaption]: "",
        [UI.MonthsDropdown]: "",
        [UI.Month]: "",
        [UI.Months]: "",
        [UI.Nav]: "",
        [UI.NextMonthButton]: "",
        [UI.PreviousMonthButton]: "",
        [UI.Week]: "",
        [UI.Weeks]: "",
        [UI.Weekday]: "",
        [UI.Weekdays]: "",
        [UI.WeekNumber]: "",
        [UI.WeekNumberHeader]: "",
        [UI.YearsDropdown]: "",
        [SelectionState.range_end]: "",
        [SelectionState.range_middle]: "",
        [SelectionState.range_start]: "",
        [SelectionState.selected]: "",
        [DayFlag.disabled]: "",
        [DayFlag.hidden]: "",
        [DayFlag.outside]: "",
        [DayFlag.focused]: "",
        [DayFlag.today]: "",
        [Animation.weeks_after_enter]: "",
        [Animation.weeks_before_exit]: "",
        [Animation.weeks_before_enter]: "",
        [Animation.weeks_after_exit]: "",
        [Animation.caption_after_enter]: "",
        [Animation.caption_before_exit]: "",
        [Animation.caption_before_enter]: "",
        [Animation.caption_after_exit]: "",
      },
      styles: {},
      labels: {
        labelNav: vi.fn(),
        labelGrid: vi.fn(),
        labelGridcell: vi.fn(),
        labelMonthDropdown: vi.fn(),
        labelYearDropdown: vi.fn(),
        labelNext: vi.fn(),
        labelPrevious: vi.fn(),
        labelDayButton: vi.fn(),
        labelWeekday: vi.fn(),
        labelWeekNumber: vi.fn(),
        labelWeekNumberHeader: vi.fn(),
      },
      formatters: {
        formatCaption: vi.fn(),
        formatDay: vi.fn(),
        formatMonthDropdown: vi.fn(),
        formatWeekNumber: vi.fn(),
        formatWeekNumberHeader: vi.fn(),
        formatWeekdayName: vi.fn(),
        formatYearDropdown: vi.fn(),
      },
      dayPickerProps: {
        mode: "single",
        required: false,
      } as DayPickerProps,
    };
  }

  beforeEach(() => {
    mockContextValue = createMockContextValue();
    wrapper = (props: { children: JSX.Element }) => (
      <DayPickerProvider value={mockContextValue}>
        {props.children}
      </DayPickerProvider>
    );
  });

  test("should return the context value when used within a DayPicker provider", () => {
    const { result } = renderHook(() => useDayPicker(), { wrapper });
    expect(result.current).toEqual(mockContextValue);
  });

  describe("when returning public calendar context values", () => {
    const targetMonth = new Date(2024, 2, 1);

    beforeEach(() => {
      const { result } = renderHook(() => useDayPicker(), { wrapper });
      context = result.current;
    });

    test("keeps the displayed month date as a Date", () => {
      expect(context.months[0].date).toBeInstanceOf(Date);
    });

    test("keeps the displayed month date value", () => {
      expect(context.months[0].date).toBe(displayedMonth);
    });

    test("keeps the next month as a Date", () => {
      expect(context.nextMonth).toBeInstanceOf(Date);
    });

    test("keeps the next month value", () => {
      expect(context.nextMonth).toBe(nextMonth);
    });

    test("keeps the previous month as a Date", () => {
      expect(context.previousMonth).toBeInstanceOf(Date);
    });

    test("keeps the previous month value", () => {
      expect(context.previousMonth).toBe(previousMonth);
    });

    test("keeps the selected value as a Date", () => {
      expect(context.selected).toBeInstanceOf(Date);
    });

    test("keeps the selected value", () => {
      expect(context.selected).toBe(selectedDate);
    });

    test("calls goToMonth with the target Date", () => {
      context.goToMonth(targetMonth);
      expect(mockContextValue.goToMonth).toHaveBeenCalledWith(targetMonth);
    });

    test("calls isSelected with the selected Date", () => {
      context.isSelected?.(selectedDate);
      expect(mockContextValue.isSelected).toHaveBeenCalledWith(selectedDate);
    });
  });
});
