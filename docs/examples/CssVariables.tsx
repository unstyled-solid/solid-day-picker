import { DayPicker } from "@solid-unstyled/daypicker";
import styles from "./styles/css-variables.module.css";

export function CssVariables() {
  return <DayPicker class={styles.datePicker} />;
}
