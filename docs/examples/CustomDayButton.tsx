import { DayButton, type DayButtonProps, DayPicker } from "@solid-unstyled/daypicker";
import { createSignal, omit, createContext, useContext } from "solid-js";
import { type Setter } from "solid-js";

const SelectedDateContext = createContext<{
  selected?: Date;
  setSelected?: Setter<Date | undefined>;
}>({});

function DayButtonWithContext(props: DayButtonProps) {
  const context261 = props; const buttonProps = omit(context261, "day", "modifiers");

  const { setSelected } = useContext(SelectedDateContext);
  return (
    <DayButton
      {...buttonProps}
      day={context261.day}
      modifiers={context261.modifiers}
      onClick={() => setSelected?.(undefined)}
      onDblClick={() => setSelected?.(context261.day.date)}
    />
  );
}

export function CustomDayButton() {
  const [selected, setSelected] = createSignal<Date | undefined>(undefined);

  return (
    <SelectedDateContext value={{ get selected() { return selected(); }, setSelected }}>
      <p>Double click to select a date or single click to clear selection</p>
      <DayPicker
        mode="single"
        selected={selected()}
        onSelect={setSelected}
        components={{
          DayButton: DayButtonWithContext,
        }}
        footer={selected()?.toDateString()}
      />
    </SelectedDateContext>
  );
}
