import { htmlProps } from '../helpers/htmlProps.js';
import type { JSX } from "@solidjs/web";

/**
 * Render the container for the weeks in the month grid.
 *
 * @group Components
 * @see https://daypicker.dev/guides/custom-components
 */
export function Weeks(props: JSX.HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody {...htmlProps(props)} />;
}

/** Props accepted by the {@link Weeks} component. */
export type WeeksProps = Parameters<typeof Weeks>[0];
