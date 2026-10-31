import { htmlProps } from '../helpers/htmlProps.js';
import type { JSX } from "@solidjs/web";

import type { CalendarMonth } from "../classes/index.js";
import { live } from "../live.js";
import { omit } from "solid-js";

/**
 * Render the caption for a month in the calendar.
 *
 * @group Components
 * @see https://daypicker.dev/guides/custom-components
 */
export function MonthCaption(
  props: {
    /** The month to display in the caption. */
    calendarMonth: CalendarMonth;
    /** The index of the month being displayed. */
    displayIndex: number;
  } & JSX.HTMLAttributes<HTMLDivElement>,
) {
  const localProps = props;
  const divProps = omit(localProps, "calendarMonth", "displayIndex");
  return <div {...htmlProps(divProps)} />;
}

/** Props accepted by the {@link MonthCaption} component. */
export type MonthCaptionProps = Parameters<typeof MonthCaption>[0];
