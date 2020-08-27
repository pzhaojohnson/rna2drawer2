import * as React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';
import Underline from './Underline';

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

describe('margin prop', () => {
  it('is passed', () => {
    act(() => {
      render(<Underline margin={'1px 2px 3px 5.5px'} />, container);
    });
    let style = window.getComputedStyle(getComponent());
    expect(style.margin).toBe('1px 2px 3px 5.5px');
  });

  it('has a default value', () => {
    act(() => {
      render(<Underline />, container);
    });
  });
});
