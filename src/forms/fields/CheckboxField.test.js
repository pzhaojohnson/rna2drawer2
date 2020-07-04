import * as React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';
import CheckboxField from './CheckboxField';

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
    render(<CheckboxField name={'blah blah'} />, container);
  });
  expect(getLabel().textContent).toBe('blah blah');
});

describe('renders with given value', () => {
  it('can render with a true value', () => {
    act(() => {
      render(<CheckboxField initialValue={true} />, container);
    });
    expect(getInput().checked).toBeTruthy();
  });

  it('can render with a false value', () => {
    act(() => {
      render(<CheckboxField initialValue={false} />, container);
    });
    expect(getInput().checked).toBeFalsy();
  });
});

it('can toggle from true to false', () => {
  let set = jest.fn();
  act(() => {
    render(<CheckboxField initialValue={true} set={set} />, container);
    getInput().dispatchEvent(new Event('click', { bubbles: true }));
  });
  // calls set callback
  expect(set).toHaveBeenCalled();
  expect(set.mock.calls[0][0]).toBe(false);
});

it('can toggle from false to true', () => {
  let set = jest.fn();
  act(() => {
    render(<CheckboxField initialValue={false} set={set} />, container);
    getInput().dispatchEvent(new Event('click', { bubbles: true }));
  });
  // calls set callback
  expect(set).toHaveBeenCalled();
  expect(set.mock.calls[0][0]).toBe(true);
});

it('can toggle multiple times', () => {
  let set = jest.fn();
  act(() => render(<CheckboxField initialValue={false} set={set} />, container));
  expect(set).not.toHaveBeenCalled();
  act(() => getInput().dispatchEvent(new Event('click', { bubbles: true })));
  expect(set.mock.calls[0][0]).toBe(true);
  act(() => getInput().dispatchEvent(new Event('click', { bubbles: true })));
  expect(set.mock.calls[1][0]).toBe(false);
  act(() => getInput().dispatchEvent(new Event('click', { bubbles: true })));
  expect(set.mock.calls[2][0]).toBe(true);
  act(() => getInput().dispatchEvent(new Event('click', { bubbles: true })));
  expect(set.mock.calls[3][0]).toBe(false);
  act(() => getInput().dispatchEvent(new Event('click', { bubbles: true })));
  expect(set.mock.calls[4][0]).toBe(true);
});
