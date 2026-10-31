import { htmlProps } from '../helpers/htmlProps.js';
import type { JSX } from "@solidjs/web";

/**
 * Render the grid of days for a specific month.
 *
 * @group Components
 * @see https://daypicker.dev/guides/custom-components
 */
export function MonthGrid(props: JSX.IntrinsicElements["table"]) {
  return <table {...htmlProps(props)} />;
}

/** Props accepted by the {@link MonthGrid} component. */
export type MonthGridProps = Parameters<typeof MonthGrid>[0];
