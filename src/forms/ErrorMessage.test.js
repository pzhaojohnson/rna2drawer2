import * as React from 'react';
import { act } from 'react-dom/test-utils';
import { render } from 'react-dom';
import { unmountComponentAtNode } from 'react-dom';

import { ErrorMessage } from './ErrorMessage';

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

describe('ErrorMessage component', () => {
  it('renders with specified message', () => {
    act(() => {
      render(<ErrorMessage message='1234 zzxXCV' />, container);
    });
    expect(container.textContent).toMatch(/1234 zzxXCV/);
  });
});
