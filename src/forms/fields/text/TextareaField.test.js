import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';
import { fireEvent } from '@testing-library/react';
import { TextareaField } from './TextareaField';

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

function getLabel() {
  return container.childNodes[0].childNodes[0];
}

function getTextarea() {
  return container.childNodes[0].childNodes[1];
}

function getErrorMessage() {
  return container.childNodes[0].childNodes[2];
}

it('renders with name', () => {
  act(() => render(<TextareaField name={'asdfQWER'} />, container));
  let l = getLabel();
  expect(l.textContent).toBe('asdfQWER:');
});

it('renders with initial value', () => {
  act(() => render(<TextareaField initialValue={'ASDF qwer'} />, container));
  let ta = getTextarea();
  expect(ta.value).toBe('ASDF qwer');
});

it('accepts all input when no checkValue callback is provided', () => {
  act(() => render(<TextareaField />, container));
  let ta = getTextarea();
  act(() => fireEvent.change(ta, { target: { value: 'asdf qwer' } }));
  expect(getErrorMessage()).toBeFalsy();
  act(() => fireEvent.change(ta, { target: { value: '' } }));
  expect(getErrorMessage()).toBeFalsy();
  act(() => fireEvent.change(ta, { target: { value: '1234' } }));
  expect(getErrorMessage()).toBeFalsy();
});

it('shows error message when checkValue callback returns one', () => {
  act(() => render(<TextareaField checkValue={s => s == 'ab' ? 'error' : ''} />, container));
  let ta = getTextarea();
  act(() => fireEvent.change(ta, { target: { value: 'ab' } }));
  expect(getErrorMessage()).toBeTruthy(); // shows error message
  act(() => fireEvent.change(ta, { target: { value: 'ac' } }));
  expect(getErrorMessage()).toBeFalsy(); // removes error message
});

it('calls on input callback props when appropriate', () => {
  let onInput = jest.fn();
  let onValidInput = jest.fn();
  let onInvalidInput = jest.fn();
  act(() => {
    render(
      <TextareaField
        checkValue={s => s == 'asdf' ? 'error' : ''}
        onInput={onInput}
        onValidInput={onValidInput}
        onInvalidInput={onInvalidInput}
      />,
      container,
    );
  });
  let ta = getTextarea();
  act(() => fireEvent.change(ta, { target: { value: 'qwer' } }));
  expect(onInput).toHaveBeenCalledTimes(1);
  expect(onValidInput).toHaveBeenCalledTimes(1);
  expect(onInvalidInput).not.toHaveBeenCalled();
  act(() => fireEvent.change(ta, { target: { value: 'asdf' } }));
  expect(onInput).toHaveBeenCalledTimes(2);
  expect(onValidInput).toHaveBeenCalledTimes(1);
  expect(onInvalidInput).toHaveBeenCalledTimes(1);
  act(() => fireEvent.change(ta, { target: { value: 'zxcv' } }));
  expect(onInput).toHaveBeenCalledTimes(3);
  expect(onValidInput).toHaveBeenCalledTimes(2);
  expect(onInvalidInput).toHaveBeenCalledTimes(1);
});

it('calls set callback on blur only when input is valid', () => {
  let set = jest.fn();
  act(() => {
    render(
      <TextareaField
        checkValue={s => s == 'asdf' ? 'error' : ''}
        set={set}
      />,
      container,
    );
  });
  let ta = getTextarea();
  act(() => fireEvent.change(ta, { target: { value: 'asdf' } }));
  expect(getErrorMessage()).toBeTruthy(); // input is invalid
  act(() => fireEvent.blur(ta, { bubbles: true }));
  expect(set).not.toHaveBeenCalled();
  act(() => fireEvent.change(ta, { target: { value: 'qwer' } }));
  expect(getErrorMessage()).toBeFalsy(); // input is valid
  act(() => fireEvent.blur(ta, { bubbles: true }));
  expect(set.mock.calls[0][0]).toBe('qwer');
});

it('passes placeholder and rows props', () => {
  act(() => render(<TextareaField placeholder={'aabbdf'} spellCheck={true} rows={192} />, container));
  let ta = getTextarea();
  expect(ta.placeholder).toBe('aabbdf');
  expect(ta.rows).toBe(192);
});
