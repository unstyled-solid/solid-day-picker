import type { DayPickerProps } from "@solid-unstyled/daypicker";
import { startOfMonth } from "date-fns";
import styles from "./styles.module.css";
import { type Setter } from "solid-js";

interface NavigationFieldsetProps {
  props: DayPickerProps;
  setProps: Setter<DayPickerProps>;
}

export function NavigationFieldset(componentProps: NavigationFieldsetProps) {
  return (
    <fieldset>
      <legend>
        Navigation{" "}
        <button
          type="button"
          onClick={() =>
            componentProps.setProps({
              ...componentProps.props,
              animate: false,
              month: undefined,
              startMonth: undefined,
              endMonth: undefined,
              hideNavigation: false,
              disableNavigation: false,
              numberOfMonths: undefined,
              reverseMonths: false,
              pagedNavigation: false,
            })
          }
        >
          Reset
        </button>
      </legend>

      <div class={styles.fields}>
        <label>
          Number of months:
          <input
            type="number"
            min={1}
            max={12}
            size={4}
            value={componentProps.props.numberOfMonths ?? ""}
            name="numberOfMonths"
            onInput={(e) => {
              const value = e.currentTarget.value;
              componentProps.setProps({
                ...componentProps.props,
                numberOfMonths:
                  value === "" ? undefined : Math.max(1, Number(value)),
              });
            }}
          />
        </label>

        {componentProps.props.numberOfMonths !== undefined && componentProps.props.numberOfMonths > 1 && (
          <label>
            <input
              type="checkbox"
              name="reverseMonths"
              checked={componentProps.props.reverseMonths}
              onInput={(e) =>
                componentProps.setProps({
                  ...componentProps.props,
                  reverseMonths: e.target.checked,
                })
              }
            />
            Reverse Months
          </label>
        )}
        {componentProps.props.numberOfMonths !== undefined && componentProps.props.numberOfMonths > 1 && (
          <label>
            <input
              type="checkbox"
              name="pagedNavigation"
              checked={componentProps.props.pagedNavigation}
              onInput={(e) =>
                componentProps.setProps({
                  ...componentProps.props,
                  pagedNavigation: e.target.checked,
                })
              }
            />
            Paged Navigation
          </label>
        )}
        <label>
          <input
            type="checkbox"
            name="animate"
            checked={componentProps.props.animate}
            onInput={(e) => componentProps.setProps({ ...componentProps.props, animate: e.target.checked })}
          />
          Animate
        </label>
        <label>
          <input
            type="checkbox"
            name="hideNavigation"
            checked={componentProps.props.hideNavigation}
            onInput={(e) =>
              componentProps.setProps({ ...componentProps.props, hideNavigation: e.target.checked })
            }
          />
          Hide Navigation
        </label>
        <label>
          <input
            type="checkbox"
            name="disableNavigation"
            checked={componentProps.props.disableNavigation}
            onInput={(e) =>
              componentProps.setProps({ ...componentProps.props, disableNavigation: e.target.checked })
            }
          />
          Disable Navigation
        </label>
        <hr
          style={{
            "border-top": "1px solid var(--ifm-color-emphasis-200)",
            "margin-bottom": "1rem",
            "margin-top": "1rem",
          }}
        />
        <label>
          Month:
          <div>
            <input
              type="number"
              min={1}
              max={12}
              value={componentProps.props.month ? new Date(componentProps.props.month).getMonth() + 1 : ""}
              name="month"
              onInput={(e) => {
                if (e.currentTarget.value === "") {
                  componentProps.setProps({
                    ...componentProps.props,
                    month: undefined,
                    startMonth: undefined,
                    endMonth: undefined,
                  });
                  return;
                }
                const newMonth = Number(e.currentTarget.value) - 1;
                const newDate = componentProps.props.month
                  ? new Date(componentProps.props.month)
                  : new Date();
                newDate.setMonth(newMonth);
                const newMonthDate = startOfMonth(newDate);
                componentProps.setProps({
                  ...componentProps.props,
                  month: newMonthDate,
                  startMonth: undefined,
                  endMonth: undefined,
                });
              }}
            />

            <input
              type="number"
              min={1900}
              max={2100}
              value={componentProps.props.month ? new Date(componentProps.props.month).getFullYear() : ""}
              name="year"
              onInput={(e) => {
                if (e.currentTarget.value === "") {
                  componentProps.setProps({
                    ...componentProps.props,
                    month: undefined,
                    startMonth: undefined,
                    endMonth: undefined,
                  });
                  return;
                }
                const newYear = Number(e.currentTarget.value);
                const newDate = componentProps.props.month
                  ? new Date(componentProps.props.month)
                  : new Date();
                newDate.setFullYear(newYear);
                const newMonthDate = startOfMonth(newDate);
                componentProps.setProps({
                  ...componentProps.props,
                  month: newMonthDate,
                  startMonth: undefined,
                  endMonth: undefined,
                });
              }}
            />
          </div>
        </label>
        <label>
          Start month:
          <div>
            <input
              type="number"
              min={1}
              max={12}
              value={
                componentProps.props.startMonth
                  ? new Date(componentProps.props.startMonth).getMonth() + 1
                  : ""
              }
              name="startMonthMonth"
              onInput={(e) => {
                if (e.currentTarget.value === "") {
                  componentProps.setProps({
                    ...componentProps.props,
                    startMonth: undefined,
                    month: componentProps.props.month,
                  });
                  return;
                }
                const newMonth = Number(e.currentTarget.value) - 1;
                const newDate = componentProps.props.startMonth
                  ? new Date(componentProps.props.startMonth)
                  : new Date();
                newDate.setMonth(newMonth);
                const newStartMonth = startOfMonth(newDate);
                componentProps.setProps({
                  ...componentProps.props,
                  startMonth: newStartMonth,
                  endMonth:
                    componentProps.props.endMonth && newStartMonth > new Date(componentProps.props.endMonth)
                      ? undefined
                      : componentProps.props.endMonth,
                  month:
                    componentProps.props.month && new Date(componentProps.props.month) < newStartMonth
                      ? newStartMonth
                      : (componentProps.props.month ?? newStartMonth),
                });
              }}
            />

            <input
              type="number"
              min={1900}
              max={2100}
              value={
                componentProps.props.startMonth ? new Date(componentProps.props.startMonth).getFullYear() : ""
              }
              name="startMonthYear"
              onInput={(e) => {
                if (e.currentTarget.value === "") {
                  componentProps.setProps({
                    ...componentProps.props,
                    startMonth: undefined,
                    month: componentProps.props.month,
                  });
                  return;
                }
                const newYear = Number(e.currentTarget.value);
                const newDate = componentProps.props.startMonth
                  ? new Date(componentProps.props.startMonth)
                  : new Date();
                newDate.setFullYear(newYear);
                const newStartMonth = startOfMonth(newDate);
                componentProps.setProps({
                  ...componentProps.props,
                  startMonth: newStartMonth,
                  endMonth:
                    componentProps.props.endMonth && newStartMonth > new Date(componentProps.props.endMonth)
                      ? undefined
                      : componentProps.props.endMonth,
                  month:
                    componentProps.props.month && new Date(componentProps.props.month) < newStartMonth
                      ? newStartMonth
                      : (componentProps.props.month ?? newStartMonth),
                });
              }}
            />
          </div>
        </label>
        <label>
          End month:
          <div>
            <input
              type="number"
              min={1}
              max={12}
              value={
                componentProps.props.endMonth ? new Date(componentProps.props.endMonth).getMonth() + 1 : ""
              }
              name="endMonthMonth"
              onInput={(e) => {
                if (e.currentTarget.value === "") {
                  componentProps.setProps({
                    ...componentProps.props,
                    endMonth: undefined,
                    month: componentProps.props.month,
                  });
                  return;
                }
                const newMonth = Number(e.currentTarget.value) - 1;
                const newDate = componentProps.props.endMonth
                  ? new Date(componentProps.props.endMonth)
                  : new Date();
                newDate.setMonth(newMonth);
                const newEndMonth = startOfMonth(newDate);
                componentProps.setProps({
                  ...componentProps.props,
                  endMonth: newEndMonth,
                  startMonth:
                    componentProps.props.startMonth && newEndMonth < new Date(componentProps.props.startMonth)
                      ? undefined
                      : componentProps.props.startMonth,
                  month:
                    componentProps.props.month && new Date(componentProps.props.month) > newEndMonth
                      ? newEndMonth
                      : componentProps.props.month,
                });
              }}
            />

            <input
              type="number"
              min={1900}
              max={2100}
              value={
                componentProps.props.endMonth ? new Date(componentProps.props.endMonth).getFullYear() : ""
              }
              name="endMonthYear"
              onInput={(e) => {
                if (e.currentTarget.value === "") {
                  componentProps.setProps({
                    ...componentProps.props,
                    endMonth: undefined,
                    month: componentProps.props.month,
                  });
                  return;
                }
                const newYear = Number(e.currentTarget.value);
                const newDate = componentProps.props.endMonth
                  ? new Date(componentProps.props.endMonth)
                  : new Date();
                newDate.setFullYear(newYear);
                const newEndMonth = startOfMonth(newDate);
                componentProps.setProps({
                  ...componentProps.props,
                  endMonth: newEndMonth,
                  startMonth:
                    componentProps.props.startMonth && newEndMonth < new Date(componentProps.props.startMonth)
                      ? undefined
                      : componentProps.props.startMonth,
                  month:
                    componentProps.props.month && new Date(componentProps.props.month) > newEndMonth
                      ? newEndMonth
                      : componentProps.props.month,
                });
              }}
            />
          </div>
        </label>
      </div>
    </fieldset>
  );
}
