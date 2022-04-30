import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';

import { CloseButton } from './CloseButton';

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

function getCloseButton() {
  return container.childNodes[0];
}

describe('CloseButton component', () => {
  it('calls onClick callback', () => {
    let onClick = jest.fn();
    act(() => {
      render(<CloseButton onClick={onClick} />, container);
      let cb = getCloseButton();
      cb.dispatchEvent(
        new Event('click', { bubbles: true })
      );
    });
    expect(onClick.mock.calls.length).toBe(1);
  });
});
