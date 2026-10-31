/** Native Solid attributes use the literal ARIA boolean values. */
export function ariaBoolean(value: boolean | undefined): "true" | "false" | undefined {
  return value === undefined ? undefined : value ? "true" : "false";
}
