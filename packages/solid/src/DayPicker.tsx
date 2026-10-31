import type { CalendarDay } from "./classes/CalendarDay.js";
import { DateLib, defaultLocale } from "./classes/DateLib.js";
import { createGetModifiers } from "./helpers/createGetModifiers.js";
import { getClassNamesForModifiers } from "./helpers/getClassNamesForModifiers.js";
import { getComponents } from "./helpers/getComponents.js";
import { getDataAttributes } from "./helpers/getDataAttributes.js";
import { getDefaultClassNames } from "./helpers/getDefaultClassNames.js";
import { getFormatters } from "./helpers/getFormatters.js";
import { getLabels } from "./helpers/getLabels.js";
import { getMonthOptions } from "./helpers/getMonthOptions.js";
import { getStyleForModifiers } from "./helpers/getStyleForModifiers.js";
import { getWeekdays } from "./helpers/getWeekdays.js";
import { getYearOptions } from "./helpers/getYearOptions.js";
import { createNoonOverrides } from "./noonDateLib.js";
import type {
  DayPickerProps,
  Modifiers,
  MoveFocusBy,
  MoveFocusDir,
  SelectedValue,
  SelectHandler,
} from "./types/index.js";
import { DayFlag, SelectionState, UI } from "./UI.js";
import { useAnimation } from "./useAnimation.js";
import { useCalendar } from "./useCalendar.js";
import { type DayPickerContext, dayPickerContext as DayPickerProvider } from "./useDayPicker.js";
import { useFocus } from "./useFocus.js";
import { useSelection } from "./useSelection.js";
import { convertMatchersToTimeZone } from "./utils/convertMatchersToTimeZone.js";
import { rangeIncludesDate } from "./utils/rangeIncludesDate.js";
import { toTimeZone } from "./utils/toTimeZone.js";
import { isDateRange } from "./utils/typeguards.js";
import { live } from "./live.js";
import { createMemo, createSignal } from "solid-js";
import { For } from "@solidjs/web";
import { ariaBoolean } from "./ariaBoolean.js";
import { createComponents } from "./helpers/createComponents.js";

/**
 * Renders the DayPicker calendar component.
 *
 * @param initialProps - The props for the DayPicker component.
 * @returns The rendered DayPicker component.
 * @group DayPicker
 * @see https://daypicker.dev
 */
export function DayPicker(initialProps: DayPickerProps) {
  const normalized = createMemo(() => {
    let props = initialProps;
    const timeZone = props.timeZone;

    if (timeZone) {
      props = {
        ...initialProps,
        timeZone,
      };
      if (props.today) {
        props.today = toTimeZone(props.today, timeZone);
      }
      if (props.month) {
        props.month = toTimeZone(props.month, timeZone);
      }
      if (props.defaultMonth) {
        props.defaultMonth = toTimeZone(props.defaultMonth, timeZone);
      }
      if (props.startMonth) {
        props.startMonth = toTimeZone(props.startMonth, timeZone);
      }
      if (props.endMonth) {
        props.endMonth = toTimeZone(props.endMonth, timeZone);
      }
      if (props.mode === "single" && props.selected) {
        props.selected = toTimeZone(props.selected, timeZone);
      } else if (props.mode === "multiple" && props.selected) {
        props.selected = props.selected?.map((date) =>
          toTimeZone(date, timeZone),
        );
      } else if (props.mode === "range" && props.selected) {
        props.selected = {
          from: props.selected.from
            ? toTimeZone(props.selected.from, timeZone)
            : props.selected.from,
          to: props.selected.to
            ? toTimeZone(props.selected.to, timeZone)
            : props.selected.to,
        };
      }
      if (props.disabled !== undefined) {
        props.disabled = convertMatchersToTimeZone(props.disabled, timeZone);
      }
      if (props.hidden !== undefined) {
        props.hidden = convertMatchersToTimeZone(props.hidden, timeZone);
      }
      if (props.modifiers) {
        const nextModifiers: NonNullable<typeof props.modifiers> = {};
        Object.keys(props.modifiers).forEach((key) => {
          nextModifiers[key] = convertMatchersToTimeZone(
            props.modifiers?.[key],
            timeZone,
          );
        });
        props.modifiers = nextModifiers;
      }
    }

    return props;
  });
  const props = new Proxy(live(() => normalized()), {
    get: (source, key) => key === "today"
      ? source.today ?? defaultToday()
      : Reflect.get(source, key),
  });
  const config = live(createMemo(() => {
    const locale = { ...defaultLocale, ...props.locale };
    const weekStartsOn = props.broadcastCalendar ? 1 : props.weekStartsOn;

    const noonOverrides =
      props.noonSafe && props.timeZone
        ? createNoonOverrides(props.timeZone, {
          weekStartsOn,
          locale,
        })
        : undefined;
    const overrides =
      props.dateLib && noonOverrides
        ? { ...noonOverrides, ...props.dateLib }
        : (props.dateLib ?? noonOverrides);

    const dateLib = new DateLib(
      {
        locale,
        weekStartsOn,
        firstWeekContainsDate: props.firstWeekContainsDate,
        useAdditionalWeekYearTokens: props.useAdditionalWeekYearTokens,
        useAdditionalDayOfYearTokens: props.useAdditionalDayOfYearTokens,
        timeZone: props.timeZone,
        numerals: props.numerals,
      },
      overrides,
    );

    return {
      dateLib,
      components: getComponents(props.components),
      formatters: getFormatters(props.formatters),
      labels: getLabels(props.labels, dateLib.options),
      locale,
      classNames: { ...getDefaultClassNames(), ...props.classNames },
    };
  }));



  const localProps = props;
  const Components = createComponents(() => config.components);

  const defaultToday = createMemo(() => config.dateLib.today());
  const derived3 = live(() => config.formatters);
  const dateLib = live(() => config.dateLib);

  const calendar = useCalendar(props, dateLib);

  const derived2 = calendar;

  const getModifiers = createMemo(() => createGetModifiers(
    derived2.days,
    props,
    derived2.navStart,
    derived2.navEnd,
    config.dateLib,
  ));

  const selection = useSelection(props, dateLib);

  const focus = useFocus(
    props,
    calendar,
    (day) => getModifiers()(day),
    (date) => selection.isSelected?.(date) ?? false,
    dateLib,
  );

  const derived1 = live(() => config.labels);

  const weekdays = createMemo(() =>
    getWeekdays(config.dateLib, props.ISOWeek, props.broadcastCalendar, props.today));

  const isInteractive = () => localProps.mode !== undefined || localProps.onDayClick !== undefined;

  const handlePreviousClick = () => {
    if (!derived2.previousMonth) return;
    derived2.goToMonth(derived2.previousMonth);
    localProps.onPrevClick?.(derived2.previousMonth);
  };

  const handleNextClick = () => {
    if (!derived2.nextMonth) return;
    derived2.goToMonth(derived2.nextMonth);
    localProps.onNextClick?.(derived2.nextMonth);
  };

  const handleDayClick = (day: CalendarDay, m: Modifiers) => (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    focus.setFocused(day);
    if (m.disabled) {
      return;
    }
    selection.select?.(day.date, m, e);
    localProps.onDayClick?.(day.date, m, e);
  };

  const handleDayFocus = (day: CalendarDay, m: Modifiers) => (e: FocusEvent) => {
    focus.setFocused(day);
    localProps.onDayFocus?.(day.date, m, e);
  };

  const handleDayBlur = (day: CalendarDay, m: Modifiers) => (e: FocusEvent) => {
    focus.blur();
    localProps.onDayBlur?.(day.date, m, e);
  };

  const handleDayKeyDown = (day: CalendarDay, modifiers: Modifiers) => (e: KeyboardEvent) => {
    const keyMap: Record<string, [MoveFocusBy, MoveFocusDir]> = {
      ArrowLeft: [
        e.shiftKey ? "month" : "day",
        props.dir === "rtl" ? "after" : "before",
      ],
      ArrowRight: [
        e.shiftKey ? "month" : "day",
        props.dir === "rtl" ? "before" : "after",
      ],
      ArrowDown: [e.shiftKey ? "year" : "week", "after"],
      ArrowUp: [e.shiftKey ? "year" : "week", "before"],
      PageUp: [e.shiftKey ? "year" : "month", "before"],
      PageDown: [e.shiftKey ? "year" : "month", "after"],
      Home: ["startOfWeek", "before"],
      End: ["endOfWeek", "after"],
    };
    if (keyMap[e.key]) {
      e.preventDefault();
      e.stopPropagation();
      const [moveBy, moveDir] = keyMap[e.key];
      focus.moveFocus(moveBy, moveDir);
    }
    localProps.onDayKeyDown?.(day.date, modifiers, e);
  };

  const handleDayMouseEnter = (day: CalendarDay, modifiers: Modifiers) => (e: MouseEvent) => {
    localProps.onDayMouseEnter?.(day.date, modifiers, e);
  };

  const handleDayMouseLeave = (day: CalendarDay, modifiers: Modifiers) => (e: MouseEvent) => {
    localProps.onDayMouseLeave?.(day.date, modifiers, e);
  };

  const handleMonthChange = (date: Date, monthOffset: number) =>
    (e: Event & { currentTarget: HTMLSelectElement }) => {
      const selectedMonth = Number(e.currentTarget.value);
      const month = config.dateLib.setMonth(
        config.dateLib.startOfMonth(date),
        selectedMonth,
      );
      derived2.goToMonth(config.dateLib.addMonths(month, -monthOffset));
    };

  const handleYearChange = (date: Date, monthOffset: number) =>
    (e: Event & { currentTarget: HTMLSelectElement }) => {
      const selectedYear = Number(e.currentTarget.value);
      const month = config.dateLib.setYear(config.dateLib.startOfMonth(date), selectedYear);
      derived2.goToMonth(config.dateLib.addMonths(month, -monthOffset));
    };

  const rootAppearance = live(createMemo(() => ({
    class: typeof props.class === 'string' || props.class === undefined
      ? [config.classNames[UI.Root], props.class].filter(Boolean).join(' ')
      : [config.classNames[UI.Root], props.class],
    style: { ...localProps.styles?.[UI.Root], ...props.style },
  })));

  const dataAttributes = live(createMemo(() => getDataAttributes(props)));

  const getDropdownStyle = (dropdown: UI.MonthsDropdown | UI.YearsDropdown) => {
    const dropdownStyle = localProps.styles?.[UI.Dropdown];
    const specificDropdownStyle = localProps.styles?.[dropdown];

    if (!dropdownStyle && !specificDropdownStyle) {
      return undefined;
    }

    return {
      ...dropdownStyle,
      ...specificDropdownStyle,
    };
  };

  const [rootElement, setRootElement] = createSignal<HTMLDivElement | undefined>(undefined);
  useAnimation(rootElement, () => Boolean(props.animate), {
    get classNames() { return config.classNames; },
    get months() { return derived2.months; },
    get focused() { return focus.focused; },
    get dateLib() { return config.dateLib; },
  });

  const contextValue: DayPickerContext<DayPickerProps> = {
    get dayPickerProps() { return props; },
    get selected() { return selection.selected as SelectedValue<DayPickerProps>; },
    get select() { return selection.select as SelectHandler<DayPickerProps>; },
    get isSelected() { return selection.isSelected; },
    get months() { return derived2.months; },
    get nextMonth() { return derived2.nextMonth; },
    get previousMonth() { return derived2.previousMonth; },
    get goToMonth() { return derived2.goToMonth; },
    get getModifiers() { return getModifiers(); },
    get components() { return config.components; },
    get classNames() { return config.classNames; },
    get styles() { return localProps.styles; },
    get labels() { return config.labels; },
    get formatters() { return config.formatters; },
  };

  return (
    <DayPickerProvider value={contextValue}>
      <Components.Root
        rootRef={props.animate ? setRootElement : undefined}
        class={rootAppearance.class}
        style={rootAppearance.style}
        dir={props.dir}
        id={props.id}
        lang={props.lang ?? config.locale.code}
        nonce={props.nonce}
        title={props.title}
        role={props.role}
        aria-label={props["aria-label"]}
        aria-labelledby={props["aria-labelledby"]}
        {...dataAttributes}
      >
        <Components.Months
          class={config.classNames[UI.Months]}
          style={localProps.styles?.[UI.Months]}
        >
          {!props.hideNavigation && !localProps.navLayout && (
            <Components.Nav
              data-animated-nav={props.animate ? "true" : undefined}
              class={config.classNames[UI.Nav]}
              style={localProps.styles?.[UI.Nav]}
              aria-label={derived1.labelNav()}
              onPreviousClick={handlePreviousClick}
              onNextClick={handleNextClick}
              previousMonth={derived2.previousMonth}
              nextMonth={derived2.nextMonth}
            />
          )}
          {<For each={derived2.months} keyed={false}>{(item, displayIndex) => {
            const calendarMonth = live(item);
            const monthOffset = () => props.reverseMonths
              ? derived2.months.length - 1 - displayIndex
              : displayIndex;

            return (
              <Components.Month
                data-animated-month={props.animate ? "true" : undefined}
                class={config.classNames[UI.Month]}
                style={localProps.styles?.[UI.Month]}
                displayIndex={displayIndex}
                calendarMonth={item()}
              >
                {localProps.navLayout === "around" &&
                  !props.hideNavigation &&
                  displayIndex === 0 && (
                    <Components.PreviousMonthButton
                      type="button"
                      class={config.classNames[UI.PreviousMonthButton]}
                      style={localProps.styles?.[UI.PreviousMonthButton]}
                      tabindex={derived2.previousMonth ? undefined : -1}
                      aria-disabled={ariaBoolean(derived2.previousMonth ? undefined : true)}
                      aria-label={derived1.labelPrevious(derived2.previousMonth)}
                      onClick={handlePreviousClick}
                      data-animated-button={props.animate ? "true" : undefined}
                    >
                      <Components.Chevron
                        disabled={derived2.previousMonth ? undefined : true}
                        class={config.classNames[UI.Chevron]}
                        style={localProps.styles?.[UI.Chevron]}
                        orientation={props.dir === "rtl" ? "right" : "left"}
                      />
                    </Components.PreviousMonthButton>
                  )}
                <Components.MonthCaption
                  data-animated-caption={props.animate ? "true" : undefined}
                  class={config.classNames[UI.MonthCaption]}
                  style={localProps.styles?.[UI.MonthCaption]}
                  calendarMonth={item()}
                  displayIndex={displayIndex}
                >
                  {localProps.captionLayout?.startsWith("dropdown") ? (
                    <Components.DropdownNav
                      class={config.classNames[UI.Dropdowns]}
                      style={localProps.styles?.[UI.Dropdowns]}
                    >
                      {(() => {
                        const monthControl =
                          localProps.captionLayout === "dropdown" ||
                            localProps.captionLayout === "dropdown-months" ? (
                            <Components.MonthsDropdown
                              class={config.classNames[UI.MonthsDropdown]}
                              aria-label={derived1.labelMonthDropdown()}
                              disabled={Boolean(props.disableNavigation)}
                              onChange={handleMonthChange(
                                calendarMonth.date,
                                monthOffset(),
                              )}
                              options={getMonthOptions(
                                calendarMonth.date,
                                derived2.navStart,
                                derived2.navEnd,
                                config.formatters,
                                config.dateLib,
                              )}
                              style={getDropdownStyle(UI.MonthsDropdown)}
                              value={config.dateLib.getMonth(calendarMonth.date)}
                            />
                          ) : (
                            <span>
                              {derived3.formatMonthDropdown(calendarMonth.date, config.dateLib)}
                            </span>
                          );

                        const yearControl =
                          localProps.captionLayout === "dropdown" ||
                            localProps.captionLayout === "dropdown-years" ? (
                            <Components.YearsDropdown
                              class={config.classNames[UI.YearsDropdown]}
                              aria-label={derived1.labelYearDropdown(config.dateLib.options)}
                              disabled={Boolean(props.disableNavigation)}
                              onChange={handleYearChange(
                                calendarMonth.date,
                                monthOffset(),
                              )}
                              options={getYearOptions(
                                derived2.navStart,
                                derived2.navEnd,
                                config.formatters,
                                config.dateLib,
                                Boolean(props.reverseYears),
                              )}
                              style={getDropdownStyle(UI.YearsDropdown)}
                              value={config.dateLib.getYear(calendarMonth.date)}
                            />
                          ) : (
                            <span>
                              {derived3.formatYearDropdown(calendarMonth.date, config.dateLib)}
                            </span>
                          );

                        const controls =
                          config.dateLib.getMonthYearOrder() === "year-first"
                            ? [yearControl, monthControl]
                            : [monthControl, yearControl];

                        return controls;
                      })()}
                      <span
                        role="status"
                        aria-live="polite"
                        style={{
                          border: 0,
                          clip: "rect(0 0 0 0)",
                          height: "1px",
                          margin: "-1px",
                          overflow: "hidden",
                          padding: 0,
                          position: "absolute",
                          width: "1px",
                          "white-space": "nowrap",
                          "word-wrap": "normal",
                        }}
                      >
                        {derived3.formatCaption(
                          calendarMonth.date,
                          config.dateLib.options,
                          config.dateLib,
                        )}
                      </span>
                    </Components.DropdownNav>
                  ) : (
                    <Components.CaptionLabel
                      class={config.classNames[UI.CaptionLabel]}
                      style={localProps.styles?.[UI.CaptionLabel]}
                      role="status"
                      aria-live="polite"
                    >
                      {derived3.formatCaption(
                        calendarMonth.date,
                        config.dateLib.options,
                        config.dateLib,
                      )}
                    </Components.CaptionLabel>
                  )}
                </Components.MonthCaption>
                {localProps.navLayout === "around" &&
                  !props.hideNavigation &&
                  displayIndex === (localProps.numberOfMonths === undefined ? 1 : localProps.numberOfMonths) - 1 && (
                    <Components.NextMonthButton
                      type="button"
                      class={config.classNames[UI.NextMonthButton]}
                      style={localProps.styles?.[UI.NextMonthButton]}
                      tabindex={derived2.nextMonth ? undefined : -1}
                      aria-disabled={ariaBoolean(derived2.nextMonth ? undefined : true)}
                      aria-label={derived1.labelNext(derived2.nextMonth)}
                      onClick={handleNextClick}
                      data-animated-button={props.animate ? "true" : undefined}
                    >
                      <Components.Chevron
                        disabled={derived2.nextMonth ? undefined : true}
                        class={config.classNames[UI.Chevron]}
                        style={localProps.styles?.[UI.Chevron]}
                        orientation={props.dir === "rtl" ? "left" : "right"}
                      />
                    </Components.NextMonthButton>
                  )}
                {displayIndex === (localProps.numberOfMonths === undefined ? 1 : localProps.numberOfMonths) - 1 &&
                  localProps.navLayout === "after" &&
                  !props.hideNavigation && (
                    <Components.Nav
                      data-animated-nav={props.animate ? "true" : undefined}
                      class={config.classNames[UI.Nav]}
                      style={localProps.styles?.[UI.Nav]}
                      aria-label={derived1.labelNav()}
                      onPreviousClick={handlePreviousClick}
                      onNextClick={handleNextClick}
                      previousMonth={derived2.previousMonth}
                      nextMonth={derived2.nextMonth}
                    />
                  )}

                <Components.MonthGrid
                  role="grid"
                  aria-multiselectable={ariaBoolean(localProps.mode === "multiple" || localProps.mode === "range")}
                  aria-label={
                    derived1.labelGrid(calendarMonth.date, config.dateLib.options, config.dateLib) ||
                    undefined
                  }
                  class={config.classNames[UI.MonthGrid]}
                  style={localProps.styles?.[UI.MonthGrid]}
                >
                  {!props.hideWeekdays && (
                    <Components.Weekdays
                      data-animated-weekdays={
                        props.animate ? "true" : undefined
                      }
                      class={config.classNames[UI.Weekdays]}
                      style={localProps.styles?.[UI.Weekdays]}
                    >
                      {localProps.showWeekNumber && (
                        <Components.WeekNumberHeader
                          aria-label={derived1.labelWeekNumberHeader(config.dateLib.options)}
                          class={config.classNames[UI.WeekNumberHeader]}
                          style={localProps.styles?.[UI.WeekNumberHeader]}
                          scope="col"
                        >
                          {derived3.formatWeekNumberHeader()}
                        </Components.WeekNumberHeader>
                      )}
                      {<For each={weekdays()} keyed={(date) => date.getTime()}>{(item) => {
                        const weekday = item(); return (
                          <Components.Weekday
                            aria-label={derived1.labelWeekday(
                              weekday,
                              config.dateLib.options,
                              config.dateLib,
                            )}
                            class={config.classNames[UI.Weekday]}
                            style={localProps.styles?.[UI.Weekday]}
                            scope="col"
                          >
                            {derived3.formatWeekdayName(weekday, config.dateLib.options, config.dateLib)}
                          </Components.Weekday>
                        );
                      }}</For>}
                    </Components.Weekdays>
                  )}
                  <Components.Weeks
                    data-animated-weeks={props.animate ? "true" : undefined}
                    class={config.classNames[UI.Weeks]}
                    style={localProps.styles?.[UI.Weeks]}
                  >
                    {<For each={calendarMonth.weeks} keyed={(week) => week.weekNumber}>{(item) => {
                      const week = live(item);
                      return (
                        <Components.Week
                          class={config.classNames[UI.Week]}
                          style={localProps.styles?.[UI.Week]}
                          week={item()}
                        >
                          {localProps.showWeekNumber && (
                            <Components.WeekNumber
                              week={item()}
                              style={localProps.styles?.[UI.WeekNumber]}
                              aria-label={derived1.labelWeekNumber(week.weekNumber, {
                                get locale() { return config.locale; },
                              })}
                              class={config.classNames[UI.WeekNumber]}
                              scope="row"
                              role="rowheader"
                            >
                              {derived3.formatWeekNumber(week.weekNumber, config.dateLib)}
                            </Components.WeekNumber>
                          )}
                          {<For each={week.days} keyed={(day) => `${day.isoDate}_${day.displayMonthId}`}>{(item) => {
                            const day = live(item); const cell = live(createMemo(() => {
                              const { date } = day;
                              const modifiers = getModifiers()(item());
                              modifiers[DayFlag.focused] =
                                !modifiers.hidden &&
                                Boolean(focus.focused?.isEqualTo(day));
                              modifiers[SelectionState.selected] =
                                selection.isSelected?.(date) || modifiers.selected;
                              if (isDateRange(selection.selected)) {
                                // add range modifiers
                                const { from, to } = selection.selected;
                                modifiers[SelectionState.range_start] = Boolean(
                                  from && to && config.dateLib.isSameDay(date, from),
                                );
                                modifiers[SelectionState.range_end] = Boolean(
                                  from && to && config.dateLib.isSameDay(date, to),
                                );
                                modifiers[SelectionState.range_middle] =
                                  rangeIncludesDate(
                                    selection.selected,
                                    date,
                                    true,
                                    config.dateLib,
                                  );
                              }
                              const style = getStyleForModifiers(
                                modifiers,
                                localProps.styles,
                                props.modifiersStyles,
                              );
                              const className = getClassNamesForModifiers(
                                modifiers,
                                config.classNames,
                                props.modifiersClassNames,
                              );
                              const ariaLabel =
                                !isInteractive() && !modifiers.hidden
                                  ? derived1.labelGridcell(
                                    date,
                                    modifiers,
                                    config.dateLib.options,
                                    config.dateLib,
                                  )
                                  : undefined;
                              return { date, modifiers, style, className, ariaLabel };
                            }));
                            const dataMonth = () => day.outside ? day.dateMonthId : undefined;
                            const disabled = () => (!cell.modifiers.focused && cell.modifiers.disabled) || undefined;
                            return (
                              <Components.Day
                                day={item()}
                                modifiers={cell.modifiers}
                                class={cell.className.join(" ")}
                                style={cell.style}
                                role="gridcell"
                                aria-selected={ariaBoolean(cell.modifiers.selected || undefined)}
                                aria-label={cell.ariaLabel}
                                data-day={day.isoDate}
                                data-month={dataMonth()}
                                data-selected={ariaBoolean(cell.modifiers.selected || undefined)}
                                data-disabled={ariaBoolean(cell.modifiers.disabled || undefined)}
                                data-hidden={ariaBoolean(cell.modifiers.hidden || undefined)}
                                data-outside={ariaBoolean(day.outside || undefined)}
                                data-focused={ariaBoolean(cell.modifiers.focused || undefined)}
                                data-today={ariaBoolean(cell.modifiers.today || undefined)}
                              >
                                {!cell.modifiers.hidden && isInteractive() ? (
                                  <Components.DayButton
                                    class={config.classNames[UI.DayButton]}
                                    style={localProps.styles?.[UI.DayButton]}
                                    type="button"
                                    day={item()}
                                    modifiers={cell.modifiers}
                                    disabled={disabled()}
                                    aria-disabled={ariaBoolean((cell.modifiers.focused &&
                                      cell.modifiers.disabled) ||
                                      undefined)}
                                    tabindex={focus.isFocusTarget(item()) ? 0 : -1}
                                    aria-label={derived1.labelDayButton(
                                      cell.date,
                                      cell.modifiers,
                                      config.dateLib.options,
                                      config.dateLib,
                                    )}
                                    onClick={handleDayClick(item(), cell.modifiers)}
                                    onBlur={handleDayBlur(item(), cell.modifiers)}
                                    onFocus={handleDayFocus(item(), cell.modifiers)}
                                    onKeyDown={handleDayKeyDown(item(), cell.modifiers)}
                                    onMouseEnter={handleDayMouseEnter(
                                      item(),
                                      cell.modifiers,
                                    )}
                                    onMouseLeave={handleDayMouseLeave(
                                      item(),
                                      cell.modifiers,
                                    )}
                                  >
                                    {derived3.formatDay(cell.date, config.dateLib.options, config.dateLib)}
                                  </Components.DayButton>
                                ) : (
                                  !cell.modifiers.hidden &&
                                  derived3.formatDay(day.date, config.dateLib.options, config.dateLib)
                                )}
                              </Components.Day>
                            );
                          }}</For>}
                        </Components.Week>
                      );
                    }}</For>}
                  </Components.Weeks>
                </Components.MonthGrid>
              </Components.Month>
            );
          }}</For>}
        </Components.Months>
        {props.footer && (
          <Components.Footer
            class={config.classNames[UI.Footer]}
            style={localProps.styles?.[UI.Footer]}
            role="status"
            aria-live="polite"
          >
            {props.footer}
          </Components.Footer>
        )}
      </Components.Root>
    </DayPickerProvider>
  );
}
