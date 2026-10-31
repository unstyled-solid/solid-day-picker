import { htmlProps } from '../helpers/htmlProps.js';
import type { JSX } from "@solidjs/web";

/**
 * Render a table header cell with the name of a weekday (e.g., "Mo", "Tu").
 *
 * @group Components
 * @see https://daypicker.dev/guides/custom-components
 */
export function Weekday(props: JSX.ThHTMLAttributes<HTMLTableCellElement>) {
  return <th {...htmlProps(props)} />;
}

/** Props accepted by the {@link Weekday} component. */
export type WeekdayProps = Parameters<typeof Weekday>[0];
