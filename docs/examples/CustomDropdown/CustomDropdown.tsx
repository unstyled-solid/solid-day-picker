import { DayPicker, type DropdownProps } from "@solid-unstyled/daypicker";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectStyles,
  SelectTrigger,
  SelectValue,
} from "./Select";
import { createSignal, createContext, useContext, type Accessor } from "solid-js";

const ContainerContext = createContext<Accessor<HTMLDivElement | null> | null>(null);

export function CustomSelectDropdown(props: DropdownProps) {
  const context338 = props;
  const container = useContext(ContainerContext);
  let changeHost: HTMLSelectElement | undefined;

  const handleValueChange = (newValue: string) => {
    if (!changeHost) return;
    changeHost.value = newValue;
    changeHost.dispatchEvent(new Event('change', {bubbles:true}));
  };

  return (
    <><select ref={changeHost} hidden aria-hidden="true" tabindex="-1" onChange={event=>{
      const handler=props.onChange;if(typeof handler==='function')handler(event);else if(handler)handler[0](handler[1],event);
    }}>
      {props.options?.map(option=><option value={option.value} disabled={option.disabled}>{option.label}</option>)}
    </select><Select value={context338.value?.toString()} onValueChange={handleValueChange}>
      <SelectTrigger aria-label={context338["aria-label"]}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent container={container?.()}>
        <SelectGroup>
          {context338.options?.map((option) => (
            <SelectItem
              value={option.value.toString()}
              disabled={option.disabled}
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select></>
  );
}

export function CustomDropdown() {
  const [selected, setSelected] = createSignal<Date | undefined | undefined>(undefined);

  // Use explicit container to make the example work in the docs with shadow DOM
  const [container, setContainer] = createSignal<HTMLDivElement | null>(null);
  const handleRef = (element: HTMLDivElement | null) => {
    setContainer(element);
  };

  return (
    <div ref={handleRef}>
      <SelectStyles />
      <ContainerContext value={container}>
        <DayPicker
          captionLayout="dropdown"
          components={{ Dropdown: CustomSelectDropdown }}
          mode="single"
          selected={selected()}
          onSelect={setSelected}
          footer={
            selected()
              ? `Selected: ${selected()!.toLocaleDateString()}`
              : "Pick a day."
          }
        />
      </ContainerContext>
    </div>
  );
}
