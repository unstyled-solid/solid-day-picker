import { dynamic } from '@solidjs/web';
import type { Accessor } from 'solid-js';
import type { CustomComponents } from '../types/shared.js';
import { getComponents } from './getComponents.js';

/** Component selection stays reactive without tracking construction of its host. */
export function createComponents(read: Accessor<CustomComponents>): CustomComponents {
  const names = Object.keys(getComponents(undefined)) as (keyof CustomComponents)[];
  return Object.fromEntries(names.map(name => [name, dynamic(() => read()[name])])) as CustomComponents;
}
