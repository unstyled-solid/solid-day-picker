import type { JSX } from '@solidjs/web';

/** Deliver native callback/array refs without wrapping or proxying the host. */
export function deliverRef<T extends Element>(ref: JSX.Ref<T>, element: T): void {
  if (typeof ref === 'function') ref(element);
  else if (Array.isArray(ref)) ref.forEach(item => deliverRef(item, element));
}
