import { amET, getDateLib as getDateLibEthiopic } from "@solid-unstyled/daypicker/ethiopic";
import { arSA, getDateLib as getDateLibHijri } from "@solid-unstyled/daypicker/hijri";
import { faIR, getDateLib as getDateLibPersian } from "@solid-unstyled/daypicker/persian";
import type { Locale } from "@solid-unstyled/daypicker";
import { DateLib } from "@solid-unstyled/daypicker";
import * as locales from "@solid-unstyled/daypicker/locale";
import styles from "./styles.module.css";
import type { DayPickerPropsWithCalendar } from "./useQueryStringSync";
import { type Setter } from "solid-js";

interface CustomizationFieldsetProps {
  props: DayPickerPropsWithCalendar;
  setProps: Setter<DayPickerPropsWithCalendar>;
  accentColor: string;
  setAccentColor: Setter<string>;
}

function resolveDateLib(props: DayPickerPropsWithCalendar) {
  if (props.calendar === "persian") {
    return getDateLibPersian({
      locale: (props.locale as Locale) ?? faIR,
      timeZone: props.timeZone,
      numerals: props.numerals,
    });
  }
  if (props.calendar === "ethiopic") {
    return getDateLibEthiopic({
      locale: (props.locale as Locale) ?? (amET as Locale),
      timeZone: props.timeZone,
      numerals: props.numerals,
    });
  }
  if (props.calendar === "hijri") {
    return getDateLibHijri({
      locale: (props.locale as Locale) ?? (arSA as Locale),
      timeZone: props.timeZone,
      numerals: props.numerals,
    });
  }
  return new DateLib({
    locale: (props.locale as Locale) ?? locales.enUS,
    timeZone: props.timeZone,
  });
}

function resolveReferenceDate(
  props: DayPickerPropsWithCalendar,
  dateLib: DateLib,
) {
  const candidates = [props.month, props.startMonth, props.defaultMonth];
  for (const candidate of candidates) {
    if (candidate instanceof Date) return candidate;
  }
  return dateLib.today();
}

export function CustomizationFieldset(componentProps: CustomizationFieldsetProps) {
  return (
    <fieldset>
      <legend>
        Customization{" "}
        <button
          type="button"
          onClick={() => {
            componentProps.setProps({
              ...componentProps.props,
              captionLayout: undefined,
              navLayout: undefined,
              showOutsideDays: false,
              showWeekNumber: false,
              fixedWeeks: false,
              hideWeekdays: false,
              reverseYears: false,
              startMonth: undefined,
              endMonth: undefined,
            });
            componentProps.setAccentColor("");
          }}
        >
          Reset
        </button>
      </legend>
      <div class={styles.fields}>
        <label>
          Navigation Layout:
          <select
            name="navLayout"
            value={componentProps.props.navLayout ?? ""}
            onChange={(e) => {
              const newProps: DayPickerPropsWithCalendar = {
                ...componentProps.props,
                navLayout: (e.currentTarget.value ?? undefined) as
                  | "around"
                  | "after"
                  | undefined,
              };
              componentProps.setProps(newProps);
            }}
          >
            <option value=""></option>
            <option value="around">Around</option>
            <option value="after">After</option>
          </select>
        </label>
        <label>
          Caption Layout:
          <select
            name="captionLayout"
            value={componentProps.props.captionLayout ?? ""}
            onChange={(e) => {
              const newCaptionLayout = e.currentTarget.value as
                | "label"
                | "dropdown"
                | "dropdown-months"
                | "dropdown-years";
              const newProps: DayPickerPropsWithCalendar = {
                ...componentProps.props,
                captionLayout: newCaptionLayout,
              };
              if (newCaptionLayout === "dropdown") {
                const dateLib = resolveDateLib(newProps);
                const referenceDate = resolveReferenceDate(newProps, dateLib);
                const hundredYearsAgo = dateLib.addYears(referenceDate, -100);
                newProps.startMonth = dateLib.startOfMonth(hundredYearsAgo);
                newProps.endMonth = dateLib.startOfMonth(referenceDate);
              } else if (newCaptionLayout === "label") {
                newProps.startMonth = undefined;
                newProps.endMonth = undefined;
              }
              componentProps.setProps(newProps);
            }}
          >
            <option></option>
            <option value="label">Label</option>
            <option value="dropdown">Dropdown</option>
            <option value="dropdown-months">Dropdown Months</option>
            <option value="dropdown-years">Dropdown Years</option>
          </select>
        </label>
        {(componentProps.props.captionLayout === "dropdown" ||
          componentProps.props.captionLayout === "dropdown-years") && (
            <label>
              <input
                type="checkbox"
                name="reverseYears"
                checked={!!componentProps.props.reverseYears}
                onInput={(e) =>
                  componentProps.setProps({ ...componentProps.props, reverseYears: e.target.checked })
                }
                disabled={
                  !(
                    componentProps.props.captionLayout === "dropdown" ||
                    componentProps.props.captionLayout === "dropdown-years"
                  )
                }
              />
              Reverse Dropdown Years
            </label>
          )}
        <label>
          <input
            type="checkbox"
            name="showOutsideDays"
            checked={componentProps.props.showOutsideDays}
            onInput={(e) =>
              componentProps.setProps({ ...componentProps.props, showOutsideDays: e.target.checked })
            }
          />
          Show outside days
        </label>
        <label>
          <input
            type="checkbox"
            name="showWeekNumber"
            checked={componentProps.props.showWeekNumber}
            onInput={(e) =>
              componentProps.setProps({ ...componentProps.props, showWeekNumber: e.target.checked })
            }
          />
          Show week number
        </label>
        <label>
          <input
            type="checkbox"
            name="fixedWeeks"
            checked={componentProps.props.fixedWeeks}
            onInput={(e) =>
              componentProps.setProps({ ...componentProps.props, fixedWeeks: e.target.checked })
            }
          />
          Fixed weeks
        </label>
        <label>
          <input
            type="checkbox"
            name="hideWeekdays"
            checked={componentProps.props.hideWeekdays}
            onInput={(e) =>
              componentProps.setProps({ ...componentProps.props, hideWeekdays: e.target.checked })
            }
          />
          Hide weekdays
        </label>
        <label>
          Accent Color:
          <input
            value={componentProps.accentColor ?? ""}
            type="color"
            name="accentColor"
            onInput={(e) => componentProps.setAccentColor(e.currentTarget.value)}
          />
        </label>
      </div>
    </fieldset>
  );
}
