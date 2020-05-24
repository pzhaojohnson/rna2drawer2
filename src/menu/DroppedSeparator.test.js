import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';

import DroppedSeparator from './DroppedSeparator';

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

function getDroppedSeparator() {
  return container.childNodes[0];
}

function getLine() {
  let ds = getDroppedSeparator();
  return ds.childNodes[0];
}

it('renders with props', () => {
  act(() => {
    render(
      <DroppedSeparator
        backgroundColor={'rgb(12, 97, 100)'}
        borderColor={'rgb(100, 75, 43)'}
      />,
      container,
    );
  });
  let ds = getDroppedSeparator();
  expect(ds.style.backgroundColor).toBe('rgb(12, 97, 100)');
  let l = getLine();
  expect(l.style.borderColor).toBe('rgb(100, 75, 43)');
});
