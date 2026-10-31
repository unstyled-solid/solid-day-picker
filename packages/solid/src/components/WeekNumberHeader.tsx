import { htmlProps } from '../helpers/htmlProps.js';
import type { JSX } from "@solidjs/web";

/**
 * Render the header cell for the week numbers column.
 *
 * @group Components
 * @see https://daypicker.dev/guides/custom-components
 */
export function WeekNumberHeader(
  props: JSX.ThHTMLAttributes<HTMLTableCellElement>,
) {
  return <th {...htmlProps(props)} />;
}

/** Props accepted by the {@link WeekNumberHeader} component. */
export type WeekNumberHeaderProps = Parameters<typeof WeekNumberHeader>[0];
