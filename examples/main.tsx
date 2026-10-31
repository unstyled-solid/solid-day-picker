import { render } from '@solidjs/web';
import '@solid-unstyled/daypicker/style.css';
import { SingleControlled } from './SingleControlled';

render(() => <main>
  <h1>Solid 2 DayPicker</h1>
  <SingleControlled />
</main>, document.getElementById('app')!);
