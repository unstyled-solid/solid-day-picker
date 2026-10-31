import { htmlProps } from '../helpers/htmlProps.js';
import type { JSX } from "@solidjs/web";

/**
 * Render the button to navigate to the previous month in the calendar.
 *
 * @group Components
 * @see https://daypicker.dev/guides/custom-components
 */
export function PreviousMonthButton(
  props: JSX.ButtonHTMLAttributes<HTMLButtonElement>,
) {
  return <button {...htmlProps(props)} />;
}

/** Props accepted by the {@link PreviousMonthButton} component. */
export type PreviousMonthButtonProps = Parameters<
  typeof PreviousMonthButton
>[0];
