import {
  DayPicker as DayPickerBuddhist,
  enUS as enUSBuddhist,
  getDateLib as getDateLibBuddhist,
  th as thBuddhist,
} from "@solid-unstyled/daypicker/buddhist";
import {
  amET as amETEthiopic,
  DayPicker as DayPickerEthiopic,
  enUS as enUSEthiopic,
  getDateLib as getDateLibEthiopic,
} from "@solid-unstyled/daypicker/ethiopic";
import {
  DayPicker as DayPickerHebrew,
  enUS as enUSHebrew,
  getDateLib as getDateLibHebrew,
  he as heHebrew,
} from "@solid-unstyled/daypicker/hebrew";
import {
  arSA as arSAHijri,
  DayPicker as DayPickerHijri,
  enUS as enUSHijri,
  getDateLib as getDateLibHijri,
} from "@solid-unstyled/daypicker/hijri";
import {
  DayPicker as DayPickerPersian,
  enUS as enUSPersian,
  faIR as faIRpersian,
  getDateLib as getDateLibPersian,
} from "@solid-unstyled/daypicker/persian";
import {
  DateLib,
  type DateRange,
  DayPicker,
  isDateRange,
} from "@solid-unstyled/daypicker";
import * as locales from "@solid-unstyled/daypicker/locale";
import { BrowserWindow } from "../BrowserWindow";
import { HighlightWithTheme } from "../HighlightWithTheme";
import { CustomizationFieldset } from "./CustomizationFieldset";
import { LocalizationFieldset } from "./LocalizationFieldset";
import { NavigationFieldset } from "./NavigationFieldset";
import { SelectionFieldset } from "./SelectionFieldset";
import { toJSX } from "./shared/toJSX";
import styles from "./styles.module.css";
import { useQueryStringSync } from "./useQueryStringSync";
import { createSignal, createMemo } from "solid-js";
import { dynamic } from "@solidjs/web";

const localeImportsByCalendar = {
  persian: { enUS: enUSPersian, faIR: faIRpersian },
  hijri: { arSA: arSAHijri, enUS: enUSHijri },
  ethiopic: { amET: amETEthiopic, enUS: enUSEthiopic },
  buddhist: { enUS: enUSBuddhist, th: thBuddhist },
  hebrew: { enUS: enUSHebrew, he: heHebrew },
};

type PlaygroundProps = {
  basePath?: string;
};

export function Playground(componentProps: PlaygroundProps) {
  const context1830 = useQueryStringSync((componentProps.basePath === undefined ? "/playground" : componentProps.basePath));
  const [selected, setSelected] = createSignal<Date | Date[] | DateRange | undefined | undefined>(undefined);

  const [accentColor, setAccentColor] = createSignal("");
  const [backgroundAccentColor, setBackgroundAccentColor] = createSignal("");
  const [rangeMiddleColor, setRangeMiddleColor] = createSignal("");

  const calendarLocale = () => (context1830.props.calendar && context1830.props.calendar in localeImportsByCalendar
    ? localeImportsByCalendar[
    context1830.props.calendar as keyof typeof localeImportsByCalendar
    ]
    : undefined);

  const localeEntries = calendarLocale()
    ? Object.entries(calendarLocale()!)
    : Object.entries(locales);
  const localeEntry = () => (context1830.props.locale &&
    localeEntries.find(([, localeValue]) => localeValue === context1830.props.locale));
  const localeName = localeEntry()?.[0];
  const localeProp = localeName ? ` locale={${localeName}}` : "";

  const importStatements=()=>{  const imports: string[] = [];

  if (context1830.props.calendar === "persian") {
    imports.push(
      `import { DayPicker${localeName ? `, ${localeName}` : ""} } from "@solid-unstyled/daypicker/persian";`,
    );
  } else if (context1830.props.calendar === "ethiopic") {
    imports.push(
      `import { DayPicker${localeName ? `, ${localeName}` : ""} } from "@solid-unstyled/daypicker/ethiopic";`,
    );
  } else if (context1830.props.calendar === "buddhist") {
    imports.push(
      `import { DayPicker${localeName ? `, ${localeName}` : ""} } from "@solid-unstyled/daypicker/buddhist";`,
    );
  } else if (context1830.props.calendar === "hebrew") {
    imports.push(
      `import { DayPicker${localeName ? `, ${localeName}` : ""} } from "@solid-unstyled/daypicker/hebrew";`,
    );
  } else if (context1830.props.calendar === "hijri") {
    imports.push(
      `import { DayPicker${localeName ? `, ${localeName}` : ""} } from "@solid-unstyled/daypicker/hijri";`,
    );
  } else {
    imports.push(`import { DayPicker } from "@solid-unstyled/daypicker";`);
    if (localeName) {
      imports.unshift(
        `import { ${localeName} } from "@solid-unstyled/daypicker/locale";`,
      );
    }
  }


return imports;};
  const formattedProps = () => (`${importStatements().join("\n")}\n\n<DayPicker${toJSX({
    ...context1830.props,
    calendar: undefined,
    locale: undefined,
    dir:
      (context1830.props.calendar === "persian" ||
        context1830.props.calendar === "hebrew" ||
        context1830.props.calendar === "hijri") &&
        context1830.props.dir === "rtl"
        ? undefined
        : context1830.props.dir,
  })}${localeProp} />`);
  const currentTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const DayPickerComponent = dynamic(() => context1830.props.calendar === "persian"
    ? DayPickerPersian
    : context1830.props.calendar === "ethiopic"
      ? DayPickerEthiopic
      : context1830.props.calendar === "buddhist"
        ? DayPickerBuddhist
        : context1830.props.calendar === "hebrew"
          ? DayPickerHebrew
          : context1830.props.calendar === "hijri"
            ? DayPickerHijri
            : DayPicker);

  const dateLib = createMemo(() => context1830.props.calendar === "persian"
    ? getDateLibPersian({
      locale: (context1830.props.locale as locales.Locale) ?? faIRpersian,
      timeZone: context1830.props.timeZone,
    })
    : context1830.props.calendar === "ethiopic"
      ? getDateLibEthiopic({
        locale: (context1830.props.locale as locales.Locale) ?? amETEthiopic,
        timeZone: context1830.props.timeZone,
        numerals: context1830.props.numerals,
      })
      : context1830.props.calendar === "buddhist"
        ? getDateLibBuddhist({
          locale: (context1830.props.locale as locales.Locale) ?? thBuddhist,
          timeZone: context1830.props.timeZone,
          numerals: context1830.props.numerals,
        })
        : context1830.props.calendar === "hebrew"
          ? getDateLibHebrew({
            locale: (context1830.props.locale as locales.Locale) ?? heHebrew,
            timeZone: context1830.props.timeZone,
            numerals: context1830.props.numerals,
          })
          : context1830.props.calendar === "hijri"
            ? getDateLibHijri({
              locale: (context1830.props.locale as locales.Locale) ?? arSAHijri,
              timeZone: context1830.props.timeZone,
              numerals: context1830.props.numerals,
            })
            : new DateLib({
              locale: (context1830.props.locale as locales.Locale) ?? locales.enUS,
              timeZone: context1830.props.timeZone,
            }));

  const selectedRange=()=>isDateRange(selected())?selected() as DateRange:undefined;
  return (
    <div class={styles.playground}>
      <h1>Playground</h1>
      <form class={styles.form}>
        <CustomizationFieldset
          props={context1830.props}
          setProps={context1830.setProps}
          accentColor={accentColor()}
          setAccentColor={setAccentColor}
        />
        <NavigationFieldset props={context1830.props} setProps={context1830.setProps} />
        <LocalizationFieldset
          props={context1830.props}
          setProps={context1830.setProps}
          currentTimeZone={currentTimeZone}
        />
        <SelectionFieldset
          props={context1830.props}
          setProps={context1830.setProps}
          selected={selected()}
          setSelected={setSelected}
          backgroundAccentColor={backgroundAccentColor()}
          setBackgroundAccentColor={setBackgroundAccentColor}
          rangeMiddleColor={rangeMiddleColor()}
          setRangeMiddleColor={setRangeMiddleColor}
        />
      </form>
      <div class={styles.browserWindow}>
        <BrowserWindow
          url=""
          styleStr={`
          .rdp-root,
          [data-theme="dark"] .rdp-root {
            ${accentColor() ? `--rdp-accent-color: ${accentColor()} !important` : ""};
            ${backgroundAccentColor() ? `--rdp-accent-background-color: ${backgroundAccentColor()} !important` : ""};
            ${rangeMiddleColor() ? `--rdp-range_middle-color: ${rangeMiddleColor()} !important` : ""};
          }
        `}
        >
          <DayPickerComponent
            {...context1830.props}
            onSelect={setSelected}
            onMonthChange={(month: Date) => {
              context1830.setProps({ ...context1830.props, month });
            }}
            // @ts-expect-error Mixing DayPicker modes
            selected={selected()}
          />
        </BrowserWindow>
      </div>
      <div class={styles.props}>
        <h2>Selection</h2>
        <output aria-live="polite">
          {selected() ? (
            <div>
              <pre>
                {context1830.props.mode === "single" && selected() && (
                  <>
                    {String(selected())} -{" "}
                    {dateLib().format(selected() as Date, "EEEE, d MMMM yyyy")}
                  </>
                )}
                {context1830.props.mode === "multiple" &&
                  (selected() as Date[] | undefined)?.map((date) => {
                    return (
                      <>
                        {String(date)} -{" "}
                        {dateLib().format(date, "EEEE, d MMMM yyyy")}
                        <br />
                      </>
                    );
                  })}
                {context1830.props.mode === "range" && isDateRange(selected()) && (
                  <>
                    From:{" "}
                    {selectedRange()!.from && (
                      <>
                        {String(selectedRange()!.from)} -{" "}
                        {dateLib().format(selectedRange()!.from!, "EEEE, d MMMM yyyy")}
                      </>
                    )}
                    <br />
                    To: {"  "}
                    {selectedRange()!.to && (
                      <>
                        {String(selectedRange()!.to)} -{" "}
                        {dateLib().format(selectedRange()!.to!, "EEEE, d MMMM yyyy")}
                      </>
                    )}
                  </>
                )}
              </pre>
            </div>
          ) : context1830.props.mode ? (
            "Pick on a day to start selection."
          ) : (
            "Choose a selection mode to display the selected days."
          )}
        </output>
        <h2>Code</h2>
        <HighlightWithTheme code={formattedProps()} language="tsx" />
      </div>
    </div>
  );
}
