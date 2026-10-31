import { htmlProps } from '../helpers/htmlProps.js';
import type { JSX } from "@solidjs/web";

/**
 * Render the footer of the calendar.
 *
 * @group Components
 * @see https://daypicker.dev/guides/custom-components
 */
export function Footer(props: JSX.HTMLAttributes<HTMLDivElement>) {
  return <div {...htmlProps(props)} />;
}

/** Props accepted by the {@link Footer} component. */
export type FooterProps = Parameters<typeof Footer>[0];
