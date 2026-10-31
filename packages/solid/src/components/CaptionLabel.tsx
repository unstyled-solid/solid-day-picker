import { htmlProps } from '../helpers/htmlProps.js';
import type { JSX } from "@solidjs/web";

/**
 * Render the label in the month caption.
 *
 * @group Components
 * @see https://daypicker.dev/guides/custom-components
 */
export function CaptionLabel(props: JSX.HTMLAttributes<HTMLSpanElement>) {
  return <span {...htmlProps(props)} />;
}

/** Props accepted by the {@link CaptionLabel} component. */
export type CaptionLabelProps = Parameters<typeof CaptionLabel>[0];
