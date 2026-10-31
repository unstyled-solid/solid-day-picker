import { DayPicker } from "@solid-unstyled/daypicker";
import classNames from "@solid-unstyled/daypicker/style.module.css";

export function CssModules() {
  return <DayPicker mode="single" classNames={classNames} />;
}
