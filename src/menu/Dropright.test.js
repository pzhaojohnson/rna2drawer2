import * as React from 'react';
import { act } from '@testing-library/react';
import { render, unmountComponentAtNode } from 'react-dom';
import { Dropright } from './Dropright';

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

it('renders with specified name', () => {
  act(() => {
    render(<Dropright name={'Specified Name'} />, container);
  });
  expect(container.textContent.includes('Specified Name')).toBeTruthy();
});

it('renders with dropped element', () => {
  let dropped = <div>asdf qwer zxcv</div>;
  act(() => {
    render(<Dropright dropped={dropped} />, container);
  });
  expect(container.textContent.includes('asdf qwer zxcv')).toBeTruthy();
});
