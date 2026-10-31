import { htmlProps } from '../helpers/htmlProps.js';
import type { JSX } from "@solidjs/web";

/**
 * Render the navigation dropdowns for the calendar.
 *
 * @group Components
 * @see https://daypicker.dev/guides/custom-components
 */
export function DropdownNav(props: JSX.HTMLAttributes<HTMLDivElement>) {
  return <div {...htmlProps(props)} />;
}

/** Props accepted by the {@link DropdownNav} component. */
export type DropdownNavProps = Parameters<typeof DropdownNav>[0];
