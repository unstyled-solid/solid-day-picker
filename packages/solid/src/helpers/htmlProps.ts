import { omit, $PROXY } from 'solid-js';

/** Match the source renderer's omission of an empty inline style on HTML hosts. */
export function htmlProps<T extends object>(props: T): Partial<T> {
  const view = omit(props, key => {
    if (key !== 'style') return false;
    const style: unknown = Reflect.get(props, 'style');
    return style == null || style === '' || typeof style === 'symbol' ||
      typeof style === 'object' && !Object.values(style).some(value => value != null && value !== '');
  });
  const proxy = new Proxy(view, {
    get(source, key) {
      // Keep native merge() from flattening away this serialization view.
      if (key === $PROXY) return proxy;
      if (typeof key === 'symbol') return undefined;
      const value = Reflect.get(source, key);
      return key.startsWith('data-') && typeof value === 'boolean'
        ? value ? 'true' : 'false' : value;
    },
  });
  return proxy;
}
