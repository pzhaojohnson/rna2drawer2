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

describe('rendering the contained element', () => {
  it('renders the contained element', () => {
    act(() => {
      render(
        <ClosableContainer contained={<div>Contained Div</div>} />,
        container,
      );
    });
    let c = getComponent();
    expect(c.textContent.includes('Contained Div')).toBeTruthy();
  });

  it('renders without a contained element', () => {
    act(() => render(<ClosableContainer />, container));
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
