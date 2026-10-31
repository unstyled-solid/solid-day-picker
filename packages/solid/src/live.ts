import { $PROXY } from 'solid-js';

/** A shallow live view. Values (dates, nodes, callbacks) retain their identity. */
export function live<T extends object>(read: () => T): T {
  const proxy = new Proxy({} as T, {
    // Runtime view detection must not subscribe the scope constructing JSX.
    get: (_, key) => key === $PROXY ? proxy : typeof key === 'symbol' ? undefined : Reflect.get(read(), key),
    has: (_, key) => key === $PROXY ? true : typeof key === 'symbol' ? false : key in read(),
    ownKeys: () => Reflect.ownKeys(read()),
    getOwnPropertyDescriptor: (_, key) => key in read()
      ? { configurable: true, enumerable: true, get: () => Reflect.get(read(), key) }
      : undefined,
  });
  return proxy;
}
