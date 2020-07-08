import * as React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';
import { fireEvent } from '@testing-library/react';
import ColorField from './ColorField';

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

function getComponent() {
  return container.childNodes[0];
}

function getInput() {
  return getComponent().childNodes[0];
}

function getLabel() {
  return getComponent().childNodes[1];
}

it('renders with given name', () => {
  act(() => {
    render(<ColorField name={'qwer zxcv'} />, container);
  });
  expect(getLabel().textContent).toBe('qwer zxcv');
});

it('renders with given initial value', () => {
  act(() => {
    render(<ColorField initialValue={'#24abf1'} />, container);
  });
  expect(getInput().value).toBe('#24abf1');
});

it('handler for change event allows value to be changed', () => {
  act(() => {
    render(<ColorField initialValue={'#000000'} set={() => {}} />, container);
    fireEvent.change(getInput(), { target: { value: '#123456' } });
  });
  expect(getInput().value).toBe('#123456');
  act(() => {
    fireEvent.change(getInput(), { target: { value: '#abfe16' } });
  });
  expect(getInput().value).toBe('#abfe16');
});

it('passes value to set callback when value is changed', () => {
  let set = jest.fn();
  act(() => {
    render(<ColorField initialValue={'#ffffff'} set={set} />, container);
    fireEvent.change(getInput(), { target: { value: '#132435' } });
  });
  expect(set.mock.calls[0][0]).toBe('#132435');
  act(() => {
    fireEvent.change(getInput(), { target: { value: '#acbdce' } });
  });
  expect(set.mock.calls[1][0]).toBe('#acbdce');
});
