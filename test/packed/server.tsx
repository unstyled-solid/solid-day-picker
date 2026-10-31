import { renderToString, generateHydrationScript, isServer } from '@solidjs/web';
import { App, RangeApp } from './App';

if (!isServer || typeof window !== 'undefined' || typeof document !== 'undefined') {
  throw new Error('SSR must run in a fresh, server-condition process without DOM globals');
}
const options = (renderId: string) => ({ renderId, onError: (error: unknown) => { throw error; } });
export const one = renderToString(() => <App />, options('one'));
export const two = renderToString(() => <RangeApp />, options('two'));
// Repeat/concurrent-independent request data must not leak through contexts.
if (renderToString(() => <App />, options('one')) !== one) throw new Error('SSR output is not deterministic across requests');
export const bootstrap = generateHydrationScript({ eventNames: ['click', 'input'] });
