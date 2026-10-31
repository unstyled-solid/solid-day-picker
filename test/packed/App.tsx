import { createSignal } from 'solid-js';
import { DayPicker, DayButton, CalendarDay, type DateRange } from '@solid-unstyled/daypicker';
import '@solid-unstyled/daypicker/style.css';
import {DayPicker as Buddhist} from '@solid-unstyled/daypicker/buddhist';
import {DayPicker as Ethiopic} from '@solid-unstyled/daypicker/ethiopic';
import {DayPicker as Hebrew} from '@solid-unstyled/daypicker/hebrew';
import {DayPicker as Hijri} from '@solid-unstyled/daypicker/hijri';
import {DayPicker as Persian} from '@solid-unstyled/daypicker/persian';

function CalendarCase(props:{name:string;Calendar:typeof Buddhist}){
  const [selected,setSelected]=createSignal<Date|undefined>(undefined);
  const Calendar=props.Calendar;
  return <section id={`calendar-${props.name}`}><Calendar defaultMonth={new Date(2024,0,1)} today={new Date(2024,0,10)} mode="single" selected={selected()} onSelect={setSelected}/><output>{selected()?'selected':'none'}</output></section>;
}

export function App() {
  const [month, setMonth] = createSignal(new Date(2024, 0, 1));
  const [selected, setSelected] = createSignal<Date | undefined>(undefined);
  const [requests, setRequests] = createSignal(0);
  const onSelect = (date: Date | undefined) => {
    setRequests(count => count + 1);
    setSelected(date);
  };
  return <main>
    <DayPicker id="single-calendar" month={month()} onMonthChange={setMonth}
      mode="single" selected={selected()} onSelect={onSelect}
      today={new Date(2024, 0, 10)} footer={selected() ? 'Selected' : 'Choose a date'} />
    <button id="external-month" onClick={() => setMonth(new Date(2024, 1, 1))}>External February</button>
    <output id="single-value">{selected()?.getDate() ?? 'none'}</output>
    <output id="single-requests">{requests()}</output>
    <DayButton id="standalone-day" day={new CalendarDay(new Date(2024,0,15),new Date(2024,0,1))}
      modifiers={{}} onClick={() => setSelected(new Date(2024,0,15))}>Standalone Day</DayButton>
  </main>;
}

export function RangeApp() {
  const [selected, setSelected] = createSignal<DateRange | undefined>(undefined);
  return <main>
    <DayPicker id="range-calendar" defaultMonth={new Date(2024, 0, 1)} mode="range"
      selected={selected()} onSelect={setSelected} animate
      today={new Date(2024, 0, 10)} />
    <output id="range-value">{selected()?.from?.getDate() ?? 'none'}:{selected()?.to?.getDate() ?? 'none'}</output>
    <CalendarCase name="buddhist" Calendar={Buddhist}/>
    <CalendarCase name="ethiopic" Calendar={Ethiopic}/>
    <CalendarCase name="hebrew" Calendar={Hebrew}/>
    <CalendarCase name="hijri" Calendar={Hijri}/>
    <CalendarCase name="persian" Calendar={Persian}/>
  </main>;
}
