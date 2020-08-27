import * as React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';
import { UnclosableFlexContainer } from './UnclosableFlexContainer';

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

it('renders title', () => {
  act(() => {
    render(
      <UnclosableFlexContainer title={'AaSsDdFfZzXxCcVv'} />,
      container,
    );
  });
  expect(container.textContent.includes('AaSsDdFfZzXxCcVv')).toBeTruthy();
});

it('renders contained element', () => {
  act(() => {
    render(
      <UnclosableFlexContainer contained={'A Contained Element'} />,
      container,
    );
  });
  expect(container.textContent.includes('A Contained Element')).toBeTruthy();
});
