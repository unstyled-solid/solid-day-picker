import { enUS as enUSBuddhist, th as thBuddhist } from "@solid-unstyled/daypicker/buddhist";
import {
  amET as amETEthiopic,
  enUS as enUSEthiopic,
} from "@solid-unstyled/daypicker/ethiopic";
import { enUS as enUSHebrew, he as heHebrew } from "@solid-unstyled/daypicker/hebrew";
import { arSA as arSAHijri, enUS as enUSHijri } from "@solid-unstyled/daypicker/hijri";
import { enUS as enUSPersian, faIR as faIRPersian } from "@solid-unstyled/daypicker/persian";
import {
  type DayPickerProps,
  defaultDateLib,
  type Numerals,
} from "@solid-unstyled/daypicker";
import * as locales from "@solid-unstyled/daypicker/locale";
import styles from "./styles.module.css";
import type { DayPickerPropsWithCalendar } from "./useQueryStringSync";
import { createMemo } from "solid-js";
import { type Setter } from "solid-js";

const timeZones = [
  "UTC",
  "Africa/Cairo",
  "Africa/Johannesburg",
  "Africa/Lagos",
  "America/Buenos_Aires",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "America/Mexico_City",
  "America/New_York",
  "America/Sao_Paulo",
  "America/Toronto",
  "America/Vancouver",
  "Antarctica/Palmer",
  "Asia/Dubai",
  "Asia/Hong_Kong",
  "Asia/Kolkata",
  "Asia/Saigon",
  "Asia/Seoul",
  "Asia/Shanghai",
  "Asia/Singapore",
  "Asia/Tokyo",
  "Australia/Brisbane",
  "Australia/Melbourne",
  "Australia/Sydney",
  "Europe/Berlin",
  "Europe/London",
  "Europe/Madrid",
  "Europe/Moscow",
  "Europe/Paris",
  "Europe/Rome",
  "Pacific/Auckland",
  "Pacific/Honolulu",
];

const numerals: { value: Numerals; label: string }[] = [
  { value: "latn", label: "Latin (Western Arabic)" },
  { value: "arab", label: "Arabic-Indic" },
  { value: "arabext", label: "Eastern Arabic-Indic (persian)" },
  { value: "deva", label: "Devanagari" },
  { value: "beng", label: "Bengali" },
  { value: "guru", label: "Gurmukhi" },
  { value: "gujr", label: "Gujarati" },
  { value: "orya", label: "Oriya" },
  { value: "tamldec", label: "Tamil" },
  { value: "telu", label: "Telugu" },
  { value: "knda", label: "Kannada" },
  { value: "mlym", label: "Malayalam" },
  // Ethiopic digits
  { value: "geez" as Numerals, label: "Ge'ez (Ethiopic)" },
  // Thai digits
  { value: "thai" as Numerals, label: "Thai" },
  { value: "mymr", label: "Myanmar" },
  { value: "khmr", label: "Khmer" },
  { value: "laoo", label: "Lao" },
  { value: "tibt", label: "Tibetan" },
];
const calendars: (
  | "persian"
  | "hijri"
  | "ethiopic"
  | "buddhist"
  | "gregorian"
  | "hebrew"
)[] = ["gregorian", "persian", "hijri", "ethiopic", "buddhist", "hebrew"];
const persianLocales = { faIR: faIRPersian, enUS: enUSPersian };
const hijriLocales = { arSA: arSAHijri, enUS: enUSHijri };
const ethiopicLocales = { amET: amETEthiopic, enUS: enUSEthiopic };
const buddhistLocales = { th: thBuddhist, enUS: enUSBuddhist };
const hebrewLocales = { he: heHebrew, enUS: enUSHebrew };

type CalendarType = NonNullable<DayPickerPropsWithCalendar["calendar"]>;

const allLocales = Object.values(locales) as DayPickerProps["locale"][];

const calendarLocales: Record<CalendarType, DayPickerProps["locale"][]> = {
  gregorian: allLocales,
  persian: Object.values(persianLocales),
  hijri: Object.values(hijriLocales),
  ethiopic: Object.values(ethiopicLocales),
  buddhist: Object.values(buddhistLocales),
  hebrew: Object.values(hebrewLocales),
};

const calendarDefaults: Partial<
  Record<
    CalendarType,
    {
      locale?: DayPickerProps["locale"];
      dir?: DayPickerPropsWithCalendar["dir"];
      numerals?: Numerals;
    }
  >
> = {
  persian: { locale: faIRPersian, dir: "rtl" },
  hijri: { locale: arSAHijri, dir: "rtl", numerals: "arab" as Numerals },
  ethiopic: { locale: amETEthiopic, numerals: "geez" as Numerals },
  buddhist: { locale: thBuddhist, numerals: "thai" as Numerals },
  hebrew: { numerals: "latn" as Numerals },
};

function getLocalesForCalendar(
  calendar?: DayPickerPropsWithCalendar["calendar"],
) {
  if (!calendar) {
    return allLocales;
  }
  return calendarLocales[calendar as CalendarType] ?? allLocales;
}

interface LocalizationFieldsetProps {
  props: DayPickerPropsWithCalendar;
  setProps: Setter<DayPickerPropsWithCalendar>;
  currentTimeZone: string;
}
export function LocalizationFieldset(componentProps: LocalizationFieldsetProps) {
  const availableLocales = createMemo(() => getLocalesForCalendar(componentProps.props.calendar));

  const handleCalendarChange = (
    event: Event & { currentTarget: HTMLSelectElement; target: HTMLSelectElement },
  ) => {
    const rawValue = event.target.value as CalendarType | "";
    const calendar = (
      rawValue === "" ? undefined : rawValue
    ) as DayPickerPropsWithCalendar["calendar"];
    const defaults = calendar
      ? calendarDefaults[calendar as CalendarType]
      : undefined;

    const nextProps: DayPickerPropsWithCalendar = {
      ...componentProps.props,
      calendar,
      locale: calendar ? (defaults?.locale ?? undefined) : undefined,
      dir: calendar ? (defaults?.dir ?? undefined) : undefined,
    };

    if (defaults?.numerals) {
      nextProps.numerals = defaults.numerals;
    }

    componentProps.setProps(nextProps);
  };

  const handleLocaleChange = (event: Event & { currentTarget: HTMLSelectElement; target: HTMLSelectElement }) => {
    const { value } = event.target;

    if (!value) {
      componentProps.setProps({ ...componentProps.props, locale: undefined });
      return;
    }

    const locale = availableLocales().find((item) => item?.code === value);
    componentProps.setProps({ ...componentProps.props, locale });
  };

  const handleNumeralsChange = (
    event: Event & { currentTarget: HTMLSelectElement; target: HTMLSelectElement },
  ) => {
    const { value } = event.target;

    if (!value) {
      componentProps.setProps({ ...componentProps.props, numerals: undefined });
      return;
    }

    componentProps.setProps({ ...componentProps.props, numerals: value as Numerals });
  };

  const handleWeekStartsOnChange = (
    event: Event & { currentTarget: HTMLSelectElement; target: HTMLSelectElement },
  ) => {
    const { value } = event.target;
    const nextProps: DayPickerPropsWithCalendar = { ...componentProps.props };

    if (!value) {
      nextProps.weekStartsOn = undefined;
    } else {
      nextProps.weekStartsOn = Number(value) as DayPickerProps["weekStartsOn"];
    }

    componentProps.setProps(nextProps);
  };

  const handleFirstWeekContainsDateChange = (
    event: Event & { currentTarget: HTMLSelectElement; target: HTMLSelectElement },
  ) => {
    const { value } = event.target;
    const nextProps: DayPickerPropsWithCalendar = { ...componentProps.props };

    if (!value) {
      nextProps.firstWeekContainsDate = undefined;
    } else {
      nextProps.firstWeekContainsDate = Number(
        value,
      ) as DayPickerProps["firstWeekContainsDate"];
    }

    componentProps.setProps(nextProps);
  };

  const handleDirectionChange = (
    event: Event & { currentTarget: HTMLInputElement; target: HTMLInputElement },
  ) => {
    const { checked } = event.target;
    const nextProps: DayPickerPropsWithCalendar = { ...componentProps.props };

    if (checked) {
      nextProps.dir = "rtl";
    } else {
      nextProps.dir = undefined;
    }

    componentProps.setProps(nextProps);
  };

  const handleBroadcastCalendarChange = (
    event: Event & { currentTarget: HTMLInputElement; target: HTMLInputElement },
  ) => {
    const { checked } = event.target;
    const nextProps: DayPickerPropsWithCalendar = {
      ...componentProps.props,
      broadcastCalendar: checked,
    };

    if (checked) {
      nextProps.showOutsideDays = true;
    }

    componentProps.setProps(nextProps);
  };

  return (
    <fieldset>
      <legend>
        Localization{" "}
        <button
          type="button"
          onClick={() => {
            componentProps.setProps({
              ...componentProps.props,
              calendar: undefined,
              locale: undefined,
              timeZone: undefined,
              noonSafe: undefined,
              numerals: undefined,
              weekStartsOn: undefined,
              firstWeekContainsDate: undefined,
              ISOWeek: false,
              dir: undefined,
              broadcastCalendar: false,
            });
          }}
        >
          Reset
        </button>
      </legend>
      <div class={styles.fields}>
        <label>
          Calendar:
          <select
            name="calendar"
            value={componentProps.props.calendar ?? ""}
            onChange={handleCalendarChange}
          >
            <option></option>
            {calendars.map((calendar) => (
              <option value={calendar}>
                {calendar}
              </option>
            ))}
          </select>
        </label>
        <label>
          Time Zone:
          <select
            name="timeZone"
            value={componentProps.props.timeZone ?? ""}
            onChange={(e) =>
              componentProps.setProps({
                ...componentProps.props,
                timeZone: e.currentTarget.value,
              })
            }
          >
            <option></option>
            <option value={componentProps.currentTimeZone}>{componentProps.currentTimeZone}</option>
            {timeZones.map((tz) => (
              <option value={tz}>
                {tz}
              </option>
            ))}
          </select>
        </label>
        {componentProps.props.timeZone ? (
          <label>
            <input
              type="checkbox"
              name="noonSafe"
              checked={!!componentProps.props.noonSafe}
              onInput={(e) =>
                componentProps.setProps({
                  ...componentProps.props,
                  noonSafe: e.target.checked || undefined,
                })
              }
            />
            Noon-safe date math
          </label>
        ) : null}
        <label>
          Locale:
          <select
            name="locale"
            value={componentProps.props.locale?.code ?? ""}
            onChange={handleLocaleChange}
          >
            <option value=""></option>
            {availableLocales()
              .filter((locale) => locale && typeof locale.code === "string")
              .map((locale) =>
                locale ? (
                  <option value={locale.code}>
                    {locale.code}
                  </option>
                ) : null,
              )}
          </select>
        </label>

        <label>
          Numerals:
          <select
            style={{ "max-width": "100px" }}
            name="numerals"
            value={componentProps.props.numerals ?? ""}
            onChange={handleNumeralsChange}
          >
            <option></option>
            {numerals.map((numeral) => (
              <option value={numeral.value}>
                {numeral.label}
              </option>
            ))}
          </select>
        </label>

        <label>
          Weeks start on:
          <select
            name="weekStartsOn"
            disabled={componentProps.props.broadcastCalendar || componentProps.props.ISOWeek}
            value={componentProps.props.weekStartsOn ?? ""}
            onChange={handleWeekStartsOnChange}
          >
            <option></option>
            {[...Array(7).keys()].map((day) => (
              <option value={day}>
                {defaultDateLib.format(new Date(2021, 0, day + 3), "EEEE")}
              </option>
            ))}
          </select>
        </label>
        <label>
          First week contains:
          <select
            disabled={componentProps.props.broadcastCalendar || componentProps.props.ISOWeek}
            name="firstWeekContainsDate"
            value={componentProps.props.firstWeekContainsDate ?? ""}
            onChange={handleFirstWeekContainsDateChange}
          >
            <option></option>
            {[1, 4].map((day) => (
              <option value={day}>
                {defaultDateLib.format(new Date(2021, 0, day), "EEEE")}
              </option>
            ))}
          </select>
        </label>
        <label>
          <input
            type="checkbox"
            name="ISOWeek"
            checked={componentProps.props.ISOWeek}
            disabled={componentProps.props.broadcastCalendar}
            onInput={(e) => componentProps.setProps({ ...componentProps.props, ISOWeek: e.target.checked })}
          />
          ISO Week
        </label>
        <label>
          <input
            type="checkbox"
            name="rtl"
            checked={componentProps.props.dir === "rtl"}
            onInput={handleDirectionChange}
          />
          Right-to-left Direction
        </label>

        <label>
          <input
            type="checkbox"
            name="broadcastCalendar"
            checked={componentProps.props.broadcastCalendar}
            onInput={handleBroadcastCalendarChange}
          />
          Broadcast Weeks
        </label>
      </div>
    </fieldset>
  );
}
