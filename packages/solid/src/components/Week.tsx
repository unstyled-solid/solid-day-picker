import { htmlProps } from '../helpers/htmlProps.js';
import type { JSX } from "@solidjs/web";

import type { CalendarWeek } from "../classes/index.js";
import { live } from "../live.js";
import { omit } from "solid-js";

/**
 * Render a table row representing a week in the calendar.
 *
 * @group Components
 * @see https://daypicker.dev/guides/custom-components
 */
export function Week(
  props: {
    /** The week to render. */
    week: CalendarWeek;
  } & JSX.HTMLAttributes<HTMLTableRowElement>,
) {
  const localProps = props;
  const trProps = omit(localProps, "week");
  return <tr {...htmlProps(trProps)} />;
}

/** Props accepted by the {@link Week} component. */
export type WeekProps = Parameters<typeof Week>[0];
