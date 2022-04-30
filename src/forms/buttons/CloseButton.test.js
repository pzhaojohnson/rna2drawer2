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

describe('CloseButton component', () => {
  it('calls onClick callback on click', () => {
    let onClick = jest.fn();
    act(() => {
      render(<CloseButton onClick={onClick} />, container);
    });
    expect(onClick).not.toHaveBeenCalled();
    container.firstChild.dispatchEvent(
      new Event('click', { bubbles: true })
    );
    expect(onClick.mock.calls.length).toBe(1);
  });
});
