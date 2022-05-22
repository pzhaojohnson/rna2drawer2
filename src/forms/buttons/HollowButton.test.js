import * as React from 'react';
import { act } from 'react-dom/test-utils';
import { render } from 'react-dom';
import { Simulate } from 'react-dom/test-utils';
import { unmountComponentAtNode } from 'react-dom';

import { HollowButton } from './HollowButton';

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

describe('HollowButton component', () => {
  it('binds onClick callback', () => {
    let onClick = jest.fn();
    act(() => {
      render(<HollowButton onClick={onClick} />, container);
    });
    expect(onClick).not.toHaveBeenCalled();
    Simulate.click(container.firstChild);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('renders with passed children', () => {
    act(() => {
      render(
        <HollowButton>
          Asdf qwer.
          <span>qqQQ12!@22</span>
        </HollowButton>,
        container,
      );
    });
    expect(container.textContent).toBe('Asdf qwer.qqQQ12!@22');
  });

  it('renders with specified CSS styles', () => {
    act(() => {
      render(<HollowButton style={{ margin: '8px 0px 2px 3px' }} />, container);
    });
    expect(container.firstChild.style.margin).toBe('8px 0px 2px 3px');
  });
});
