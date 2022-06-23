import * as React from 'react';
import { render } from 'react-dom';
import { act } from 'react-dom/test-utils';
import { unmountComponentAtNode } from 'react-dom';

import { DrawingSlideshow } from './DrawingSlideshow';

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

describe('DrawingSlideshow component', () => {
  it('renders', () => {
    act(() => {
      render(<DrawingSlideshow />, container);
    });
  });
});
