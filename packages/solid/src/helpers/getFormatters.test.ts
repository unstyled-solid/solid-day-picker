import * as formatterModule from "../formatters";
// Jest's CJS namespace was a plain object; Vitest's ESM namespace has a tag.
const defaultFormatters = { ...formatterModule };

import { getFormatters } from "./getFormatters";

const customFormattersMock = {
  formatCaption: vi.fn(() => "custom caption"),
  formatYearDropdown: vi.fn(() => "custom year"),
};

test("returns default formatters when custom formatters are not provided", () => {
  const formatters = getFormatters(undefined);
  expect(formatters).toEqual(defaultFormatters);
});

test("merges custom formatters with default formatters", () => {
  const formatters = getFormatters(customFormattersMock);
  expect(formatters).toEqual(expect.objectContaining(customFormattersMock));
});
