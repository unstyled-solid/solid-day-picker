import { htmlProps } from '../helpers/htmlProps.js';
import type { JSX } from "@solidjs/web";

import type { CalendarMonth } from "../classes/CalendarMonth.js";
import { live } from "../live.js";
import { omit } from "solid-js";

/**
 * Render the grid with the weekday header row and the weeks for a specific
 * month.
 *
 * @group Components
 * @see https://daypicker.dev/guides/custom-components
 */
export function Month(
  props: {
    /** The month to display in the grid. */
    calendarMonth: CalendarMonth;
    /** The index of the month being displayed. */
    displayIndex: number;
  } & JSX.HTMLAttributes<HTMLDivElement>,
) {
  const localProps = props;
  const divProps = omit(localProps, "calendarMonth", "displayIndex");
  return <div {...htmlProps(divProps)}>{props.children}</div>;
}

/** Props accepted by the {@link Month} component. */
export type MonthProps = Parameters<typeof Month>[0];
