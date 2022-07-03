import * as React from 'react';
import { render } from 'react-dom';
import { act } from 'react-dom/test-utils';
import { Simulate } from 'react-dom/test-utils';
import { unmountComponentAtNode } from 'react-dom';

import { SubmitButton } from './SubmitButton';

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

describe('SubmitButton component', () => {
  it('renders with provided children', () => {
    act(() => {
      render(
        <SubmitButton>
          <span>12345</span>
          abCde
        </SubmitButton>,
        container,
      );
    });
    expect(container.textContent).toBe('12345abCde');
  });

  it('binds onClick callback', () => {
    let onClick = jest.fn();
    act(() => {
      render(<SubmitButton onClick={onClick} />, container);
    });
    expect(onClick).not.toHaveBeenCalled();
    Simulate.click(container.firstChild);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('renders with the specified inline CSS styles', () => {
    act(() => {
      render(<SubmitButton style={{ margin: '0px 0px 12.87px 1px' }} />, container);
    });
    expect(container.firstChild.style.margin).toBe('0px 0px 12.87px 1px');
  });
});
