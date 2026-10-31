import { hydrate } from '@solidjs/web';
import { flush } from 'solid-js';
import { App, RangeApp } from './App';

declare global {
  interface Window {
    before: { roots: Element[]; buttons: Element[] };
    hydrated: boolean;
    disposeCalendars: () => void;
  }
}

const first = hydrate(() => <App />, document.getElementById('one')!, { renderId: 'one' });
const second = hydrate(() => <RangeApp />, document.getElementById('two')!, { renderId: 'two' });
flush();
window.hydrated = true;
window.disposeCalendars = () => { first(); second(); };
