import { htmlProps } from '../helpers/htmlProps.js';
import { ariaBoolean } from '../ariaBoolean.js';
import type { JSX } from "@solidjs/web";
import { UI } from "../UI.js";
import { useDayPicker } from "../useDayPicker.js";
import { live } from "../live.js";
import { omit } from "solid-js";
import { createComponents } from "../helpers/createComponents.js";

/** An option to use in the dropdown. Maps to the `<option>` HTML element. */
export type DropdownOption = {
  /** The value of the option. */
  value: number;
  /** The label of the option. */
  label: string;
  /** Whether the dropdown option is disabled (e.g., out of the calendar range). */
  disabled: boolean;
};

/**
 * Render a dropdown component for navigation in the calendar.
 *
 * @group Components
 * @see https://daypicker.dev/guides/custom-components
 */
export function Dropdown(
  props: {
    /** The options to display in the dropdown. */
    options?: DropdownOption[] | undefined;
  } & Omit<JSX.SelectHTMLAttributes<HTMLSelectElement>, "children">,
) {
  const localProps = props;
  const selectProps = omit(localProps, "options", "class");
  const context = useDayPicker();
  const Components = createComponents(() => context.components);

  const cssClassSelect = () => [context.classNames[UI.Dropdown], localProps.class];

  const selectedOption = () => localProps.options?.find(
    ({ value }) => value === selectProps.value,
  );
  const dataDisabled = () => selectProps.disabled === undefined || typeof selectProps.disabled === 'symbol'
    ? undefined : ariaBoolean(Boolean(selectProps.disabled));
  return (
    <span
      data-disabled={dataDisabled()}
      class={context.classNames[UI.DropdownRoot]}
      {...htmlProps({get style() {return context.styles?.[UI.DropdownRoot];}})}
    >
      <Components.Select class={cssClassSelect()} {...selectProps}>
        {localProps.options?.map(({ value, label, disabled }) => (
          <Components.Option value={value} disabled={disabled}>
            {label}
          </Components.Option>
        ))}
      </Components.Select>
      <span
        class={context.classNames[UI.CaptionLabel]}
        {...htmlProps({get style() {return context.styles?.[UI.CaptionLabel];}})}
        aria-hidden="true"
      >
        {selectedOption()?.label}
        <Components.Chevron
          orientation="down"
          size={18}
          class={context.classNames[UI.Chevron]}
          style={context.styles?.[UI.Chevron]}
        />
      </span>
    </span>
  );
}

/** Props accepted by the {@link Dropdown} component. */
export type DropdownProps = Parameters<typeof Dropdown>[0];
