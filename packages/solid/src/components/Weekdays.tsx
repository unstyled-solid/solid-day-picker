import { htmlProps } from '../helpers/htmlProps.js';
import type { JSX } from "@solidjs/web";

/**
 * Render the table row containing the weekday names.
 *
 * @group Components
 * @see https://daypicker.dev/guides/custom-components
 */
export function Weekdays(props: JSX.HTMLAttributes<HTMLTableRowElement>) {
  return (
    <thead aria-hidden="true">
      <tr {...htmlProps(props)} />
    </thead>
  );
}

/** Props accepted by the {@link Weekdays} component. */
export type WeekdaysProps = Parameters<typeof Weekdays>[0];
