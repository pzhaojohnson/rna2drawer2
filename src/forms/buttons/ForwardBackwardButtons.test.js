import * as React from 'react';
import { act } from 'react-dom/test-utils';
import { render } from 'react-dom';
import { Simulate } from 'react-dom/test-utils';
import { unmountComponentAtNode } from 'react-dom';

import { BringToFrontButton } from './ForwardBackwardButtons';
import { SendToBackButton } from './ForwardBackwardButtons';
import { ForwardBackwardButtons } from './ForwardBackwardButtons';

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

describe('BringToFrontButton component', () => {
  it('binds onClick callback', () => {
    let onClick = jest.fn();
    act(() => {
      render(<BringToFrontButton onClick={onClick} />, container);
    });
    expect(onClick).not.toHaveBeenCalled();
    Simulate.click(container.firstChild);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('renders with specified CSS styles', () => {
    act(() => {
      render(<BringToFrontButton style={{ marginTop: '38.27px' }} />, container);
    });
    expect(container.firstChild.style.marginTop).toBe('38.27px');
  });
});

describe('SendToBackButton component', () => {
  it('binds onClick callback', () => {
    let onClick = jest.fn();
    act(() => {
      render(<SendToBackButton onClick={onClick} />, container);
    });
    expect(onClick).not.toHaveBeenCalled();
    Simulate.click(container.firstChild);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('renders with specified CSS styles', () => {
    act(() => {
      render(<SendToBackButton style={{ marginLeft: '22.105px' }} />, container);
    });
    expect(container.firstChild.style.marginLeft).toBe('22.105px');
  });
});

describe('ForwardBackwardButtons component', () => {
  it('passes bringToFront and sendToBack callbacks to their respective buttons', () => {
    let bringToFront = jest.fn();
    let sendToBack = jest.fn();
    act(() => {
      render(
        <ForwardBackwardButtons bringToFront={bringToFront} sendToBack={sendToBack} />,
        container,
      );
    });

    let buttons = container.getElementsByTagName('button');
    let bringToFrontButton = buttons[0];
    let sendToBackButton = buttons[1];

    // check that buttons are referenced correctly
    expect(bringToFrontButton.textContent).toBe('Bring to Front');
    expect(sendToBackButton.textContent).toBe('Send to Back');

    expect(bringToFront).not.toHaveBeenCalled();
    Simulate.click(bringToFrontButton);
    expect(bringToFront).toHaveBeenCalledTimes(1);

    expect(sendToBack).not.toHaveBeenCalled();
    Simulate.click(sendToBackButton);
    expect(sendToBack).toHaveBeenCalledTimes(1);
  });

  it('renders with specified CSS styles', () => {
    act(() => {
      render(<ForwardBackwardButtons style={{ margin: '5px 6px 1.2px 0.03px' }} />, container);
    });
    expect(container.firstChild.style.margin).toBe('5px 6px 1.2px 0.03px');
  });
});
