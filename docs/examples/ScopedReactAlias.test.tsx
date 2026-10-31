import { DayPicker as BuddhistDayPicker } from "@solid-unstyled/daypicker/buddhist";
import {
  DayPicker,
  type MonthCaptionProps,
  useDayPicker as useScopedDayPicker,
} from "@solid-unstyled/daypicker/core";
import { es } from "@solid-unstyled/daypicker/locale";
import { es as esSubpath } from "@solid-unstyled/daypicker/locale/es";
import classNames from "@solid-unstyled/daypicker/style.module.css";
import {
  DayPicker as LegacyDayPicker,
  useDayPicker as useLegacyDayPicker,
} from "@solid-unstyled/daypicker";
import { render } from "@/test/render";
import "@solid-unstyled/daypicker/style.css";


function CoInstalledMonthCaption(props: MonthCaptionProps) {
  const scopedContext = useScopedDayPicker();
  const legacyContext = useLegacyDayPicker();

  return (
    <span data-testid="co-installed-caption">
      {props.calendarMonth.date.getFullYear()}-{scopedContext.months.length}-
      {legacyContext.months.length}
    </span>
  );
}

test("the React package mirrors the DayPicker public surface", async () => {
  const requiredPackage = await import('@solid-unstyled/daypicker');

  expect(requiredPackage.DayPicker).toBeDefined();
  expect(DayPicker).toBeDefined();
  expect(esSubpath).toBe(es);
  expect(classNames).toBeDefined();

  const scopedCalendar = render(
    () => (<DayPicker month={new Date(2024, 0, 1)} mode="single" />),
  );
  expect(
    scopedCalendar.container.querySelector(".rdp-root"),
  ).toBeInTheDocument();
});

test("same-version scoped and legacy imports share the DayPicker implementation", () => {
  expect(DayPicker).toBe(LegacyDayPicker);

  const calendar = render(
    () => (<DayPicker
      month={new Date(2024, 0, 1)}
      components={{ MonthCaption: CoInstalledMonthCaption }}
    />),
  );

  expect(calendar.getByTestId("co-installed-caption")).toHaveTextContent(
    "2024-1-1",
  );
});

test("calendar packages render through the React package boundary", () => {
  const calendar = render(
    () => (<BuddhistDayPicker month={new Date(2024, 0, 1)} mode="single" />),
  );

  expect(calendar.container.querySelector(".rdp-root")).toBeInTheDocument();
});
