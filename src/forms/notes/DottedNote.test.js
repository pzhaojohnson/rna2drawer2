import * as React from 'react';
import { act } from 'react-dom/test-utils';
import { render } from 'react-dom';
import { unmountComponentAtNode } from 'react-dom';

import { DottedNote } from './DottedNote';

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

describe('DottedNote component', () => {
  it('has no text content by default', () => {
    act(() => {
      render(<DottedNote />, container);
    });
    expect(container.textContent).toBe('');
  });

  it('renders text children', () => {
    act(() => {
      render(
        <DottedNote>Asdf qwer zxcv.</DottedNote>,
        container,
      );
    });
    expect(container.textContent).toBe('Asdf qwer zxcv.');
  });

  it('renders paragraph and span element children', () => {
    act(() => {
      render(
        <DottedNote>
          <p>A paragraph and <span>span</span> note.</p>
        </DottedNote>,
        container,
      );
    });
    expect(container.textContent).toBe('A paragraph and span note.');
  });

  it('renders with specified CSS styles', () => {
    act(() => {
      render(<DottedNote style={{ marginTop: '88.098px' }} />, container);
    });
    expect(container.firstChild.style.marginTop).toBe('88.098px');
  });
});
