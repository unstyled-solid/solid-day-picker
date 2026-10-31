import { htmlProps } from '../helpers/htmlProps.js';
import type { JSX } from "@solidjs/web";

import type { CalendarWeek } from "../classes/index.js";
import { live } from "../live.js";
import { omit } from "solid-js";

/**
 * Render a table cell displaying the number of the week.
 *
 * @group Components
 * @see https://daypicker.dev/guides/custom-components
 */
export function WeekNumber(
  props: {
    /** The week to display. */
    week: CalendarWeek;
  } & JSX.ThHTMLAttributes<HTMLTableCellElement>,
) {
  const localProps = props;
  const thProps = omit(localProps, "week");
  return <th {...htmlProps(thProps)} />;
}

/** Props accepted by the {@link WeekNumber} component. */
export type WeekNumberProps = Parameters<typeof WeekNumber>[0];
