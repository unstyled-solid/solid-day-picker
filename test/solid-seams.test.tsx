import { renderProps, renderHook, act, screen } from './render';
import { DayPicker } from '../packages/solid/src/DayPicker';
import { dateButton } from './elements';
import { user } from './user';
import { DayButton } from '../packages/solid/src/components/DayButton';
import { CalendarDay } from '../packages/solid/src/classes/CalendarDay';
import { useDayPicker } from '../packages/solid/src/useDayPicker';
import { getOwner, isDisposed, type Owner } from 'solid-js';
import type { DayButtonProps } from '../packages/solid/src/components/DayButton';

const january = new Date(2024, 0, 1);
const fifteenth = new Date(2024, 0, 15);

test('native renderer fixture preserves a simple host under live prop replacement', () => {
  const Fixture = (props: { label: string }) => <button>{props.label}</button>;
  const view = renderProps(Fixture, { label: 'before' });
  const button = view.getByRole('button');
  view.rerender({ label: 'after' });
  expect(view.getByRole('button')).toBe(button);
  expect(button).toHaveTextContent('after');
});

test('native callback and array refs compose with DayButton focus ownership', () => {
  const first = vi.fn();
  const second = vi.fn();
  const view = renderProps(DayButton, {
    day: new CalendarDay(fifteenth, january), modifiers: { focused: false },
    ref: [first, second], children: '15',
  });
  const button = view.getByRole('button');
  expect(first).toHaveBeenCalledWith(button);
  expect(second).toHaveBeenCalledWith(button);
  view.rerender({ day: new CalendarDay(fifteenth, january), modifiers: { focused: true }, ref: [first, second], children: '15' });
  expect(view.getByRole('button')).toBe(button);
  expect(button).toHaveFocus();
  expect(first).toHaveBeenCalledOnce();
  view.unmount();
});

test('native class arrays and conditional objects preserve the default root class', () => {
  const view = renderProps(DayPicker, { month: january, class: ['custom', { active: true, hidden: false }] });
  expect(view.container.querySelector('.rdp-root')).toHaveClass('rdp-root', 'custom', 'active');
  expect(view.container.querySelector('.rdp-root')).not.toHaveClass('hidden');
});

test('the required native context preserves the source missing-provider error', () => {
  expect(() => renderHook(() => useDayPicker())).toThrow('useDayPicker() must be used within a custom component.');
});

test('calendar disposal releases the owners of custom day components', () => {
  const owners: Owner[] = [];
  const CustomDay = (props: DayButtonProps) => {
    owners.push(getOwner()!);
    return <DayButton {...props} />;
  };
  const view = renderProps(DayPicker, { month: january, mode: 'single', components: { DayButton: CustomDay } });
  expect(owners).toHaveLength(31);
  expect(owners.every(owner => !isDisposed(owner))).toBe(true);
  view.unmount();
  expect(owners.every(isDisposed)).toBe(true);
});

test('uncontrolled selection updates the original day host and its modifiers', async () => {
  const view = renderProps(DayPicker, { month: january, mode: 'single' });
  const button = dateButton(fifteenth);
  await user.click(button);
  expect(dateButton(fifteenth)).toBe(button);
  expect(button.parentElement).toHaveAttribute('aria-selected', 'true');
  expect(document.activeElement).toBe(button);
  await user.click(button);
  expect(dateButton(fifteenth)).toBe(button);
  expect(button.parentElement).not.toHaveAttribute('aria-selected');
  view.unmount();
});

test('controlled refusal retains selected state; later acceptance updates existing hosts', async () => {
  const onSelect = vi.fn();
  const view = renderProps(DayPicker, { month: january, mode: 'single', selected: january, onSelect });
  const button = dateButton(fifteenth);
  await user.click(button);
  expect(onSelect.mock.calls[0][0]).toEqual(fifteenth);
  expect(button.parentElement).not.toHaveAttribute('aria-selected');
  expect(dateButton(january).parentElement).toHaveAttribute('aria-selected', 'true');
  view.rerender({ month: january, mode: 'single', selected: fifteenth, onSelect });
  expect(dateButton(fifteenth)).toBe(button);
  expect(button.parentElement).toHaveAttribute('aria-selected', 'true');
});

test('controlled multiple and range selection retain the original hosts', () => {
  const onSelect = vi.fn();
  const view = renderProps(DayPicker, { month: january, mode: 'multiple', selected: [january], onSelect });
  const button = dateButton(fifteenth);
  view.rerender({ month: january, mode: 'multiple', selected: [january, fifteenth], onSelect });
  expect(dateButton(fifteenth)).toBe(button);
  expect(button.parentElement).toHaveAttribute('data-selected', 'true');
  view.rerender({ month: january, mode: 'range', selected: { from: january, to: fifteenth }, onSelect });
  expect(dateButton(fifteenth)).toBe(button);
  expect(button.parentElement).toHaveClass('rdp-range_end');
  expect(dateButton(new Date(2024, 0, 10)).parentElement).toHaveClass('rdp-range_middle');
});

test('live props replace callback, disabled matcher, labels and custom styles', async () => {
  const first = vi.fn();
  const second = vi.fn();
  const view = renderProps(DayPicker, { month: january, mode: 'single', onDayClick: first });
  const button = dateButton(fifteenth);
  view.rerender({ month: january, mode: 'single', onDayClick: second, disabled: fifteenth, labels: { labelDayButton: () => 'custom day' } });
  expect(button).toBeDisabled();
  expect(button).toHaveAccessibleName('custom day');
  view.rerender({ month: january, mode: 'single', onDayClick: second, modifiersStyles: { selected: { color: 'red' } } });
  await user.click(button);
  expect(first).not.toHaveBeenCalled();
  expect(second).toHaveBeenCalledOnce();
  expect(button.parentElement).toHaveAttribute('style', 'color: red;');
});

test('changing a controlled month retains the root, navigation and index-keyed month host', () => {
  const view = renderProps(DayPicker, { month: january });
  const root = view.container.querySelector('.rdp-root');
  const month = view.container.querySelector('.rdp-month');
  const next = screen.getByRole('button', { name: 'Go to the Next Month' });
  view.rerender({ month: new Date(2024, 1, 1) });
  expect(view.container.querySelector('.rdp-root')).toBe(root);
  expect(view.container.querySelector('.rdp-month')).toBe(month);
  expect(screen.getByRole('button', { name: 'Go to the Next Month' })).toBe(next);
  expect(screen.getByRole('grid')).toHaveAccessibleName('February 2024');
});

test('native keyboard movement and callback identity survive focus updates', async () => {
  const callback = vi.fn();
  renderProps(DayPicker, { month: january, mode: 'single', onDayKeyDown: callback });
  const button = dateButton(fifteenth);
  act(() => button.focus());
  await user.keyboard('{ArrowRight}');
  expect(document.activeElement).toBe(dateButton(new Date(2024, 0, 16)));
  expect(callback).toHaveBeenCalledOnce();
  expect(callback.mock.calls[0][2]).toBeInstanceOf(KeyboardEvent);
  expect(dateButton(fifteenth)).toBe(button);
});
