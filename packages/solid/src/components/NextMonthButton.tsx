import { htmlProps } from '../helpers/htmlProps.js';
import type { JSX } from "@solidjs/web";

/**
 * Render the button to navigate to the next month in the calendar.
 *
 * @group Components
 * @see https://daypicker.dev/guides/custom-components
 */
export function NextMonthButton(
  props: JSX.ButtonHTMLAttributes<HTMLButtonElement>,
) {
  return <button {...htmlProps(props)} />;
}

/** Props accepted by the {@link NextMonthButton} component. */
export type NextMonthButtonProps = Parameters<typeof NextMonthButton>[0];
