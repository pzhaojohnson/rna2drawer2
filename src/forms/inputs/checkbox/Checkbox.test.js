import * as React from 'react';
import { act } from 'react-dom/test-utils';
import { render } from 'react-dom';
import { fireEvent } from '@testing-library/react';
import { unmountComponentAtNode } from 'react-dom';

import { Checkbox } from './Checkbox';

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

test('Checkbox component', () => {
  // render checked
  act(() => {
    render(<Checkbox checked={true} onChange={jest.fn()} />, container);
  });
  expect(container.firstChild.checked).toBeTruthy();

  // render unchecked
  act(() => {
    render(<Checkbox checked={false} onChange={jest.fn()} />, container);
  });
  expect(container.firstChild.checked).toBeFalsy();

  // passes onChange callback
  let onChange = jest.fn();
  act(() => {
    render(<Checkbox checked={true} onChange={onChange} />, container);
  });
  expect(onChange).not.toHaveBeenCalled();
  act(() => {
    fireEvent.click(container.firstChild, { bubbles: true });
  });
  expect(onChange).toHaveBeenCalledTimes(1);
});
