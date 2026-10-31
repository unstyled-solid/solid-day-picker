import type { Component } from "solid-js";
import { createSignal, flush } from "solid-js";
import { render as nativeRender } from "@solidjs/testing-library";
import type { JSX } from "@solidjs/web";
import { live } from "../packages/solid/src/live";

import {fireEvent as domFireEvent} from '@testing-library/dom';
export { screen, within } from "@testing-library/dom";
// Source fireEvent was wrapped in React act; native writes commit through flush.
export const fireEvent=Object.assign(
  (...args:Parameters<typeof domFireEvent>)=>act(()=>domFireEvent(...args)),
  Object.fromEntries(Object.entries(domFireEvent).map(([name,fn])=>[name,(...args:unknown[])=>act(()=>Reflect.apply(fn,domFireEvent,args))])),
) as unknown as typeof domFireEvent;
export type { ByRoleOptions } from "@testing-library/dom";

export function act<T>(fn: () => T): T {
  const value = fn();
  flush();
  return value;
}

export function render(factory: () => JSX.Element, options?: Parameters<typeof nativeRender>[1]) {
  const view = nativeRender(factory, options);
  flush();
  return view;
}

/** Upstream rerender actions update live props, without re-running component setup. */
export function renderProps<P extends object>(Component: Component<P>, initial: NoInfer<P> & { [key: `data-${string}`]: unknown }) {
  let replace!: (props: P) => void;
  const view = render(() => {
    const [value, setValue] = createSignal<P>(() => initial);
    replace = next => { setValue(() => next); flush(); };
    const props = live(value);
    return <Component {...props} />;
  });
  return { ...view, rerender: (next: P & { [key: `data-${string}`]: unknown }) => replace(next) };
}

/** Hook setup is owned once; getters expose committed native state. */
export function renderHook<R>(hook: () => R, options?: { wrapper?: Component<{ children: JSX.Element }> }) {
  let current!: R;
  const Read = () => { current = hook(); return null; };
  const view = render(() => <Read />, options);
  return { result: { get current() { return current; } }, unmount: view.unmount };
}
