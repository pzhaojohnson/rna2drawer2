import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';
import { DroppedSeparator } from './DroppedSeparator';

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

it('renders with props', () => {
  act(() => {
    render(
      <DroppedSeparator
        backgroundColor='rgb(12, 97, 100)'
        borderStyle='dashed'
        borderWidth='12.3px'
        borderColor='rgb(100, 75, 43)'
      />,
      container,
    );
  });
  let ele = container.childNodes[0];
  expect(ele.style.backgroundColor).toBe('rgb(12, 97, 100)');
  expect(ele.style.borderStyle).toBe('dashed');
  expect(ele.style.borderWidth).toBe('12.3px');
  expect(ele.style.borderColor).toBe('rgb(100, 75, 43)');
});
