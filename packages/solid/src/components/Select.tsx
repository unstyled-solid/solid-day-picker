import { htmlProps } from '../helpers/htmlProps.js';
import type { JSX } from "@solidjs/web";

/**
 * Render a `select` element.
 *
 * @group Components
 * @see https://daypicker.dev/guides/custom-components
 */
export function Select(props: JSX.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...htmlProps(props)} />;
}

/** Props accepted by the {@link Select} component. */
export type SelectProps = Parameters<typeof Select>[0];
