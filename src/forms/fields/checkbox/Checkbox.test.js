import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';
import { fireEvent } from '@testing-library/react';
import { Checkbox } from './Checkbox';

function isChecked(checkbox) {
  let eles = checkbox.getElementsByTagName('img');
  return eles.length == 1 && eles[0].alt == 'Check';
}

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
  let onChange = jest.fn();
  act(() => {
    render(<Checkbox checked={true} onChange={onChange} />, container);
  });
  expect(isChecked(container.firstChild)).toBeTruthy();
  
  // click 10 times
  let i = 0;
  let intervalId;
  intervalId = setInterval(() => {
    if (i >= 10) {
      clearInterval(intervalId);
    } else {
      act(() => {
        fireEvent.click(container.firstChild, { bubbles: true });
      });
      i++;

      setTimeout(() => {
        // checks and unchecks
        expect(isChecked(container.firstChild)).toBe(i % 2 == 1);
        
        // calls change callback
        expect(onChange.mock.calls.length).toBe(i + 1);
        expect(onChange.mock.calls[i][0]).toEqual({ target: { checked: i % 2 == 1 } });
      }, 250);
    }
  }, 1000);
});
