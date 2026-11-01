import {renderProps} from '@/test/render';
import {Select, SelectContent, SelectTrigger} from './Select';

test('trigger children stay live without replacing the native host', () => {
  const Fixture = (props: {label:string}) => <Select><SelectTrigger>{props.label}</SelectTrigger></Select>;
  const view = renderProps(Fixture, {label:'January'});
  const trigger = view.getByRole('combobox');
  expect(trigger).toHaveTextContent('January');
  view.rerender({label:'February'});
  expect(view.getByRole('combobox')).toBe(trigger);
  expect(trigger).toHaveTextContent('February');
  expect(trigger).not.toHaveTextContent('January');
});

test('content follows a replacement portal container and live children', () => {
  const first = document.createElement('div');
  const second = document.createElement('div');
  const Fixture = (props: {container:HTMLElement;label:string}) => <Select><SelectContent container={props.container}>{props.label}</SelectContent></Select>;
  const view = renderProps(Fixture, {container:first,label:'January'});
  expect(first.querySelector('[role="listbox"]')).toHaveTextContent('January');
  view.rerender({container:second,label:'February'});
  expect(first.querySelector('[role="listbox"]')).toBeNull();
  expect(second.querySelector('[role="listbox"]')).toHaveTextContent('February');
  view.unmount();
  expect(second.querySelector('[role="listbox"]')).toBeNull();
});
