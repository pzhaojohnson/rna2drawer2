import * as React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';
import ErrorMessage from './ErrorMessage';

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

function getErrorMessage() {
  return container.childNodes[0];
}

describe('message prop', () => {
  it('renders the text of the message', () => {
    act(() => {
      render(<ErrorMessage message={'A unique message'} />, container);
    });
    expect(getErrorMessage().textContent).toBe('A unique message');
  });

  it('is empty by default', () => {
    act(() => {
      render(<ErrorMessage />, container);
    });
    expect(getErrorMessage().textContent).toBeFalsy();
  });
});

it('does not render p element when message is empty', () => {
  act(() => {
    render(<ErrorMessage message={''} />, container);
  });
  expect(getErrorMessage().childNodes.length).toBe(0);
});
