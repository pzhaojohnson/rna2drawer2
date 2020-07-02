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

it('renders with unique ID', () => {
  /* Necessary for the fade in animation to occur when the component
  is rerendered without the message or other props changing. */
  act(() => {
    render(<ErrorMessage />, container);
  });
  expect(getErrorMessage().id).toBeTruthy();
});

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

describe('margin prop', () => {
  it('renders with given margin prop', () => {
    act(() => {
      render(<ErrorMessage margin={'37px 112px'} />, container);
    });
    let style = window.getComputedStyle(getErrorMessage());
    expect(style.margin).toBe('37px 112px');
  });

  it('is zero by default', () => {
    act(() => {
      render(<ErrorMessage message={'asdf'} />, container);
    });
    let style = window.getComputedStyle(getErrorMessage());
    expect(style.margin).toBe('0px');
  });
});

it('does not render p element when message is empty', () => {
  act(() => {
    render(<ErrorMessage message={''} />, container);
  });
  expect(getErrorMessage().childNodes.length).toBe(0);
});

describe('fontSize prop', () => {
  it('renders with given fontSize prop', () => {
    act(() => {
      render(<ErrorMessage message={'qwer'} fontSize={'49.2px'} />, container);
    });
    let em = getErrorMessage();
    let style = window.getComputedStyle(em.childNodes[0]);
    expect(style.fontSize).toBe('49.2px');
  });

  it('has a default value', () => {
    act(() => {
      render(<ErrorMessage message={'asdf'} />, container);
    });
  });
});
