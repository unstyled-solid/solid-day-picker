import { htmlProps } from '../helpers/htmlProps.js';
import type { JSX } from "@solidjs/web";
import { createEffect } from "solid-js";

import type { CalendarDay } from "../classes/index.js";
import type { Modifiers } from "../types/index.js";
import { live } from "../live.js";
import { omit } from "solid-js";
import { deliverRef } from '../helpers/deliverRef.js';

/**
 * Render a button for a specific day in the calendar.
 *
 * @group Components
 * @see https://daypicker.dev/guides/custom-components
 */
export function DayButton(
  props: {
    /** The day to render. */
    day: CalendarDay;
    /** The modifiers to apply to the day. */
    modifiers: Modifiers;
  } & JSX.ButtonHTMLAttributes<HTMLButtonElement>,
) {
  const localProps = props;
  const buttonProps = omit(localProps, "day", "modifiers", "ref");

  let element: HTMLButtonElement | undefined;
  createEffect(() => props.modifiers.focused, (focused) => {
    if (focused) element?.focus();
  });
  return <button {...htmlProps(buttonProps)} ref={(node) => {
    element = node;
    deliverRef(props.ref, node);
  }} />;
}

/** Props accepted by the {@link DayButton} component. */
export type DayButtonProps = Parameters<typeof DayButton>[0];
