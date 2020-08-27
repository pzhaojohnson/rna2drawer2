import * as React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';
import ClosableContainer from './ClosableContainer';

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

function getComponent() {
  return container.childNodes[0];
}

function getCloseButton() {
  return getComponent().childNodes[0];
}

describe('close callback', () => {
  it('binds close button', () => {
    let close = jest.fn();
    act(() => {
      render(<ClosableContainer close={close} />, container);
    });
    let cb = getCloseButton();
    expect(close).not.toHaveBeenCalled();
    act(() => {
      cb.dispatchEvent(new Event('click', { bubbles: true }));
    });
    expect(close).toHaveBeenCalled();
  });
});

describe('children', () => {
  it('renders children', () => {
    act(() => {
      render(
        <ClosableContainer children={[
          <div>Child 1</div>,
          <div>Child 2</div>,
          <p>Child 3</p>,
        ]} />,
        container,
      );
    });
    let c = getComponent();
    expect(c.childNodes[1].textContent).toBe('Child 1');
    expect(c.childNodes[2].textContent).toBe('Child 2');
    expect(c.childNodes[3].textContent).toBe('Child 3');
  });

  it('handles missing children', () => {
    act(() => {
      render(<ClosableContainer />, container);
    });
    let c = getComponent();
    expect(c.childNodes[0]).toBe(getCloseButton());
    expect(c.childNodes.length).toBe(1);
  });
});

describe('width prop', () => {
  it('renders with given width', () => {
    act(() => {
      render(<ClosableContainer width={'1209px'} />, container);
    });
    let style = window.getComputedStyle(getComponent());
    expect(style.width).toBe('1209px');
  });

  it('has a default width', () => {
    act(() => render(<ClosableContainer />, container));
    let style = window.getComputedStyle(getComponent());
    expect(style.width).toBe('400px'); // not sure how to avoid hard coding this...
  });
});
