import React from 'react';
import { act } from 'react-dom/test-utils';
import { render, unmountComponentAtNode } from 'react-dom';
import { FloatingDrawingsContainer } from './FloatingDrawingsContainer';

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

it('renders with contained element', () => {
  act(() => {
    render(
      <FloatingDrawingsContainer
        contained={<div>Contained Element</div>}
      />,
      container,
    );
  });
  expect(container.textContent).toMatch(/Contained Element/);
});
