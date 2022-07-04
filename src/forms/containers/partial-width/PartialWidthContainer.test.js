import * as React from 'react';
import { act } from 'react-dom/test-utils';
import { render } from 'react-dom';
import { unmountComponentAtNode } from 'react-dom';

import { PartialWidthContainer } from './PartialWidthContainer';

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

describe('PartialWidthContainer component', () => {
  it('renders with title and children', () => {
    act(() => {
      render((
        <PartialWidthContainer
          unmount={jest.fn()}
          history={{
            goBackward: jest.fn(),
            canGoBackward: jest.fn(() => false),
            goForward: jest.fn(),
            canGoForward: jest.fn(() => true),
          }}
          title='Children A and B'
        >
          <p>Child A.</p>
          <p>Child B.</p>
        </PartialWidthContainer>
      ), container);
    });
    // rendered with title
    expect(container.textContent).toMatch('Children A and B');
    // rendered with children
    expect(container.textContent).toMatch('Child A.');
    expect(container.textContent).toMatch('Child B.');
    expect(container.textContent).not.toMatch('Child C.');
  });
});
