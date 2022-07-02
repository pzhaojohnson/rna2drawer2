import * as React from 'react';
import { act } from 'react-dom/test-utils';
import { render } from 'react-dom';
import { Simulate } from 'react-dom/test-utils';
import { unmountComponentAtNode } from 'react-dom';

import { OptionsToggle } from './OptionsToggle';

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

describe('OptionsToggle component', () => {
  it('calls onClick callback on click', () => {
    let onClick = jest.fn();
    act(() => {
      render(<OptionsToggle onClick={onClick} />, container);
    });
    expect(onClick).not.toHaveBeenCalled();
    Simulate.click(container.firstChild);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('renders with provided children', () => {
    act(() => {
      render(
        <OptionsToggle>
          Asdf
          <span>qwerVCZX</span>
        </OptionsToggle>,
        container,
      );
    });
    expect(container.textContent).toBe('AsdfqwerVCZX');
  });

  it('renders with provided CSS styles', () => {
    act(() => {
      render(<OptionsToggle style={{ marginRight: '23.87px' }} />, container);
    });
    expect(container.firstChild.style.marginRight).toBe('23.87px');
  });
});
