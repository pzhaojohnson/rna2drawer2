import * as React from 'react';
import { act } from 'react-dom/test-utils';
import { render } from 'react-dom';
import { unmountComponentAtNode } from 'react-dom';

import { FieldDescription } from './FieldDescription';

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

describe('FieldDescription component', () => {
  it('renders with specified children', () => {
    act(() => {
      render(
        <FieldDescription>
          <span>Asdf qwer.</span>
          11 22 34.
        </FieldDescription>,
        container,
      );
    });
    expect(container.textContent).toMatch(/Asdf qwer.11 22 34./);
  });

  it('renders with specified CSS styles', () => {
    act(() => {
      render(<FieldDescription style={{ marginTop: '37.28px' }} />, container);
    });
    expect(container.firstChild.style.marginTop).toBe('37.28px');
  });
});
