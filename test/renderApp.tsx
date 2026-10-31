import { render, screen } from "@/test/render";
import type { JSX } from "@solidjs/web";

/**
 * Renders the examples into an application for easier testing.
 *
 * @deprecated This is ugly and should be removed.
 */
export function renderApp(example: () => JSX.Element): {
  dayPicker: HTMLElement | ChildNode | null;
  renderResult: ReturnType<typeof render>;
} {
  const renderResult = render(() => <div role="application">{example()}</div>);
  return {
    dayPicker: screen.getByRole("application").firstChild,
    renderResult,
  };
}
