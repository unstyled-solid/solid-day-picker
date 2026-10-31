import type { DateRange, DayPickerProps } from "@solid-unstyled/daypicker";
import styles from "./styles.module.css";
import { type Setter } from "solid-js";

interface SelectionFieldsetProps {
  props: DayPickerProps;
  setProps: Setter<DayPickerProps>;
  selected: Date | Date[] | DateRange | undefined;
  setSelected: Setter<Date | Date[] | DateRange | undefined>;
  backgroundAccentColor: string;
  setBackgroundAccentColor: Setter<string>;
  rangeMiddleColor: string | undefined;
  setRangeMiddleColor: Setter<string>;
}

export function SelectionFieldset(componentProps: SelectionFieldsetProps) {
  return (
    <fieldset>
      <legend>
        Selection{" "}
        <button
          type="button"
          onClick={() => {
            componentProps.setSelected(undefined);
            componentProps.setProps({
              ...componentProps.props,
              mode: undefined,
              required: undefined,
              min: undefined,
              max: undefined,
              selected: undefined,
            });
            componentProps.setBackgroundAccentColor("");
            componentProps.setRangeMiddleColor("");
          }}
        >
          Reset
        </button>
      </legend>
      <div class={styles.fields}>
        <label>
          Selection mode:
          <select
            name="mode"
            value={componentProps.props.mode ?? ""}
            onChange={(e) => {
              const mode = e.currentTarget.value || undefined;
              const newProps = {
                ...componentProps.props,
                mode,
              };
              componentProps.setSelected(undefined);
              // @ts-expect-error Not working well with the union type
              componentProps.setProps(newProps);
            }}
          >
            <option></option>
            <option value="single">single</option>
            <option value="multiple">multiple</option>
            <option value="range">range</option>
          </select>
        </label>
        {componentProps.props.mode && (
          <label>
            <input
              type="checkbox"
              checked={componentProps.props.required}
              name="required"
              onInput={(e) => {
                componentProps.setSelected(undefined);
                // @ts-expect-error abc
                componentProps.setProps({ ...componentProps.props, required: e.target.checked });
              }}
            />
            Required
          </label>
        )}
        {componentProps.props.mode === "range" && (
          <label>
            <input
              type="checkbox"
              checked={componentProps.props.resetOnSelect}
              name="resetOnSelect"
              onInput={(e) => {
                componentProps.setProps({ ...componentProps.props, resetOnSelect: e.target.checked });
              }}
            />
            Reset range on select
          </label>
        )}
        {componentProps.props.mode === "range" || componentProps.props.mode === "multiple" ? (
          <label>
            Min Selection:
            <input
              type="number"
              min={0}
              max={12}
              size={4}
              name="min"
              value={componentProps.props.min ?? ""}
              onInput={(e) => {
                componentProps.setProps({
                  ...componentProps.props,
                  min: Number(e.currentTarget.value),
                });
              }}
            />
          </label>
        ) : null}
        {componentProps.props.mode === "range" || componentProps.props.mode === "multiple" ? (
          <label>
            Max Selection:
            <input
              type="number"
              min={0}
              max={12}
              size={4}
              name="max"
              value={componentProps.props.max ?? ""}
              onInput={(e) => {
                componentProps.setProps({
                  ...componentProps.props,
                  max: Number(e.currentTarget.value),
                });
              }}
            />
          </label>
        ) : null}
        {componentProps.props.mode === "range" && (
          <>
            <label>
              Range Background:
              <input
                value={componentProps.backgroundAccentColor ?? ""}
                type="color"
                onInput={(e) => componentProps.setBackgroundAccentColor(e.currentTarget.value)}
              />
            </label>
            <label>
              Range Foreground:
              <input
                value={componentProps.rangeMiddleColor ?? ""}
                type="color"
                onInput={(e) => componentProps.setRangeMiddleColor(e.currentTarget.value)}
              />
            </label>
          </>
        )}
      </div>
    </fieldset>
  );
}
