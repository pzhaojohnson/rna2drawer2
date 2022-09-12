import * as React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';
import { fireEvent } from '@testing-library/react';
import { SequenceField } from './SequenceField';

let container = null;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
});

afterEach(() => {
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

it('renders initial value', () => {
  act(() => render(<SequenceField initialValue={'asdf QWER'} />, container));
  expect(container.getElementsByTagName('textarea')[0].value).toBe('asdf QWER');
});

it('calls set callback with current value when changed', () => {
  let set = jest.fn();
  act(() => render(<SequenceField initialValue={''} set={set} />, container));
  let textarea = container.getElementsByTagName('textarea')[0];
  act(() => fireEvent.change(textarea, { target: { value: 'asdf' } }));
  expect(set.mock.calls[0][0]).toBe('asdf');
  act(() => fireEvent.change(textarea, { target: { value: 'a sequence' } }));
  expect(set.mock.calls[1][0]).toBe('a sequence');
});

it('binds callback to toggle parsing details', () => {
  let toggle = jest.fn();
  act(() => render(<SequenceField initialValue={''} toggleParsingDetails={toggle} />, container));
  let field = container.childNodes[0];
  let header = field.childNodes[0];
  expect(toggle).not.toHaveBeenCalled();
  act(() => {
    fireEvent(header.childNodes[1].childNodes[0], new MouseEvent('click', { bubbles: true }));
  });
  expect(toggle).toHaveBeenCalled();
});
