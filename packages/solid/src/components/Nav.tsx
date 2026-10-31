import { htmlProps } from '../helpers/htmlProps.js';
import type { JSX } from "@solidjs/web";

import { UI } from "../UI.js";
import { useDayPicker } from "../useDayPicker.js";
import { live } from "../live.js";
import { omit } from "solid-js";
import { ariaBoolean } from "../ariaBoolean.js";
import { createComponents } from "../helpers/createComponents.js";

/**
 * Render the navigation toolbar with buttons to navigate between months.
 *
 * @group Components
 * @see https://daypicker.dev/guides/custom-components
 */
export function Nav(
  props: {
    /** Handler for the previous month button click. */
    onPreviousClick?: JSX.EventHandler<HTMLButtonElement, MouseEvent>;
    /** Handler for the next month button click. */
    onNextClick?: JSX.EventHandler<HTMLButtonElement, MouseEvent>;
    /** The date of the previous month, if available. */
    previousMonth?: Date | undefined;
    /** The date of the next month, if available. */
    nextMonth?: Date | undefined;
  } & JSX.HTMLAttributes<HTMLElement>,
) {
  const localProps = props;
  const navProps = omit(localProps, "onPreviousClick", "onNextClick", "previousMonth", "nextMonth");

  const context = useDayPicker();
  const Components = createComponents(() => context.components);

  const handleNextClick = (e: MouseEvent & { currentTarget: HTMLButtonElement; target: Element }) => {
    if (localProps.nextMonth) {
      localProps.onNextClick?.(e);
    }
  };

  const handlePreviousClick = (e: MouseEvent & { currentTarget: HTMLButtonElement; target: Element }) => {
    if (localProps.previousMonth) {
      localProps.onPreviousClick?.(e);
    }
  };

  return (
    <nav {...htmlProps(navProps)}>
      <Components.PreviousMonthButton
        type="button"
        class={context.classNames[UI.PreviousMonthButton]}
        style={context.styles?.[UI.PreviousMonthButton]}
        tabindex={localProps.previousMonth ? undefined : -1}
        aria-disabled={ariaBoolean(localProps.previousMonth ? undefined : true)}
        aria-label={context.labels.labelPrevious(localProps.previousMonth)}
        onClick={handlePreviousClick}
      >
        <Components.Chevron
          disabled={localProps.previousMonth ? undefined : true}
          class={context.classNames[UI.Chevron]}
          style={context.styles?.[UI.Chevron]}
          orientation="left"
        />
      </Components.PreviousMonthButton>
      <Components.NextMonthButton
        type="button"
        class={context.classNames[UI.NextMonthButton]}
        style={context.styles?.[UI.NextMonthButton]}
        tabindex={localProps.nextMonth ? undefined : -1}
        aria-disabled={ariaBoolean(localProps.nextMonth ? undefined : true)}
        aria-label={context.labels.labelNext(localProps.nextMonth)}
        onClick={handleNextClick}
      >
        <Components.Chevron
          disabled={localProps.nextMonth ? undefined : true}
          orientation="right"
          class={context.classNames[UI.Chevron]}
          style={context.styles?.[UI.Chevron]}
        />
      </Components.NextMonthButton>
    </nav>
  );
}

/** Props accepted by the {@link Nav} component. */
export type NavProps = Parameters<typeof Nav>[0];
