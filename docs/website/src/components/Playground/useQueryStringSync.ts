import type {DayPickerProps} from '@solid-unstyled/daypicker';
import * as locales from '@solid-unstyled/daypicker/locale';
import {createSignal,createEffect} from 'solid-js';
import {buildPlaygroundQueryString,parsePlaygroundSearch} from './shared/queryString';
export type DayPickerPropsWithCalendar=DayPickerProps&{calendar?:'gregorian'|'persian'|'hijri'|'ethiopic'|'buddhist'|'hebrew'};
export function useQueryStringSync(basePath='/playground') {
  const initialProps=parsePlaygroundSearch(typeof window==='undefined'?'':window.location.search,Object.values(locales)) as DayPickerPropsWithCalendar;
  const [props,setProps]=createSignal(initialProps);
  createEffect(props,value=>{
    if(typeof window==='undefined')return;
    const query=buildPlaygroundQueryString(value as Record<string,unknown>);
    if(window.location.search!==query)window.history.replaceState(null,'',basePath+query);
  });
  return {get props(){return props();},setProps};
}
