import "@testing-library/jest-dom/vitest";
import { cleanup } from "@solidjs/testing-library";
import { afterEach, beforeEach, expect, vi } from "vitest";

import "./dateMatchers";

const warn = console.warn.bind(console);
let diagnostics: string[] = [];
let restoreWarn = () => {};
beforeEach(() => {
  diagnostics = [];
  const spy = vi.spyOn(console, "warn").mockImplementation((...args: unknown[]) => {
    const message = String(args[0]);
    if (/^\[[A-Z][A-Z0-9_]+\]/.test(message)) diagnostics.push(message);
    warn(...args);
  });
  restoreWarn = () => spy.mockRestore();
});
afterEach(() => {
  cleanup();
  restoreWarn();
  vi.clearAllMocks();
  expect(diagnostics, "Unexpected Solid development diagnostics").toEqual([]);
});
