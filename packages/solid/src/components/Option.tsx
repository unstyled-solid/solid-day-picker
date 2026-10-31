import { htmlProps } from '../helpers/htmlProps.js';
import type { JSX } from "@solidjs/web";

/**
 * Render an `option` element.
 *
 * @group Components
 * @see https://daypicker.dev/guides/custom-components
 */
export function Option(props: JSX.OptionHTMLAttributes<HTMLOptionElement>) {
  return <option {...htmlProps(props)} />;
}

/** Props accepted by the {@link Option} component. */
export type OptionProps = Parameters<typeof Option>[0];
