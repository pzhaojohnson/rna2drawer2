import * as React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';
import Title from './Title';

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

describe('text prop', () => {
  it('is passed', () => {
    act(() => {
      render(<Title text={'blah blah'} />, container);
    });
    expect(getComponent().textContent).toBe('blah blah');
  });

  it('is empty by default', () => {
    act(() => {
      render(<Title />, container);
    });
    expect(getComponent().textContent).toBeFalsy();
  });
});

describe('margin prop', () => {
  it('is passed', () => {
    act(() => {
      render(<Title margin={'12.2px 58.1px'} />, container);
    });
    let style = window.getComputedStyle(getComponent());
    expect(style.margin).toBe('12.2px 58.1px');
  });

  it('has a default value', () => {
    act(() => {
      render(<Title />, container);
    });
  });
});

describe('fontSize prop', () => {
  it('is passed', () => {
    act(() => {
      render(<Title fontSize={'108.9px'} />, container);
    });
    let style = window.getComputedStyle(getComponent());
    expect(style.fontSize).toBe('108.9px');
  });

  it('has a default value', () => {
    act(() => {
      render(<Title text={'asdf'} />, container);
    });
  });
});
