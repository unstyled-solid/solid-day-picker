import { htmlProps } from '../helpers/htmlProps.js';
import type { JSX } from "@solidjs/web";
import { live } from "../live.js";
import { omit } from "solid-js";
import { deliverRef } from '../helpers/deliverRef.js';

/**
 * Render the root element of the calendar.
 *
 * @group Components
 * @see https://daypicker.dev/guides/custom-components
 */
export function Root(
  props: {
    /** Ref for the root element, used when `animate` is `true`. */
    rootRef?: JSX.Ref<HTMLDivElement>;
  } & JSX.HTMLAttributes<HTMLDivElement>,
) {
  const localProps = props;
  const rest = omit(localProps, "rootRef");
  return <div {...htmlProps(rest)} ref={(node) => {
    deliverRef(props.rootRef, node);
  }} />;
}

/** Props accepted by the {@link Root} component. */
export type RootProps = Parameters<typeof Root>[0];
