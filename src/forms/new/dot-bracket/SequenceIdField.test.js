import * as React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';
import { fireEvent } from '@testing-library/react';
import { SequenceIdField } from './SequenceIdField';

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

it('renders with initial value', () => {
  act(() => render(<SequenceIdField initialValue={'Blah Bleh asdf'} />, container));
  expect(container.getElementsByTagName('input')[0].value).toBe('Blah Bleh asdf');
});

it('calls set callback with current value when changed', () => {
  let set = jest.fn();
  act(() => render(<SequenceIdField initialValue={''} set={set} />, container));
  let input = container.getElementsByTagName('input')[0];
  act(() => fireEvent.change(input, { target: { value: 'A' } }));
  expect(set.mock.calls[0][0]).toBe('A');
  act(() => fireEvent.change(input, { target: { value: 'qwer' } }));
  expect(set.mock.calls[1][0]).toBe('qwer');
});
