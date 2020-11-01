import * as React from 'react';
import { act } from '@testing-library/react';
import { render, unmountComponentAtNode } from 'react-dom';
import { RightCaret } from './RightCaret';

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

it('renders with specified height and padding', () => {
  act(() => {
    render(<RightCaret height={'22px'} padding={'4px 8px'} />, container);
  });
  let img = container.childNodes[0];
  expect(img.style.height).toBe('22px');
  expect(img.style.padding).toBe('4px 8px');
});
