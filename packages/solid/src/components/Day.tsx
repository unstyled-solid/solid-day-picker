import { htmlProps } from '../helpers/htmlProps.js';
import type { JSX } from "@solidjs/web";

import type { CalendarDay } from "../classes/index.js";
import type { Modifiers } from "../types/index.js";
import { live } from "../live.js";
import { omit } from "solid-js";

/**
 * Render a grid cell for a specific day in the calendar.
 *
 * Handles interaction and focus for the day. If you only need to change the
 * content of the day cell, consider swapping the `DayButton` component
 * instead.
 *
 * @group Components
 * @see https://daypicker.dev/guides/custom-components
 */
export function Day(
  props: {
    /** The day to render. */
    day: CalendarDay;
    /** The modifiers to apply to the day. */
    modifiers: Modifiers;
  } & JSX.HTMLAttributes<HTMLTableCellElement>,
) {
  const localProps = props;
  const tdProps = omit(localProps, "day", "modifiers");
  return <td {...htmlProps(tdProps)} />;
}

/** Props accepted by the {@link Day} component. */
export type DayProps = Parameters<typeof Day>[0];
