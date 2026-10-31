import { htmlProps } from '../helpers/htmlProps.js';
import type { JSX } from "@solidjs/web";

/**
 * Render a container wrapping the month grids.
 *
 * @group Components
 * @see https://daypicker.dev/guides/custom-components
 */
export function Months(props: JSX.HTMLAttributes<HTMLDivElement>) {
  return <div {...htmlProps(props)} />;
}

/** Props accepted by the {@link Months} component. */
export type MonthsProps = Parameters<typeof Months>[0];
