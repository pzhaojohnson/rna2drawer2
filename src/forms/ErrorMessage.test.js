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

describe('renders with unique ID', () => {
  /* Necessary for the fade in animation to occur when the component
  is rerendered without the message or other props changing. */

  it('with empty message', () => {
    act(() => {
      render(<ErrorMessage message={''} />, container);
    });
    expect(getErrorMessage().id).toBeTruthy();
  });

  it('with nonempty message', () => {
    act(() => {
      render(<ErrorMessage message={'Error'} />, container);
    });
    expect(getErrorMessage().id).toBeTruthy();
  });
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
  describe('renders with given margin prop', () => {
    it('with empty message', () => {
      act(() => {
        render(<ErrorMessage message={''} margin={'37px 112px'} />, container);
      });
      let style = window.getComputedStyle(getErrorMessage());
      expect(style.margin).toBe('37px 112px');
    });

    it('with nonempty message', () => {
      act(() => {
        render(<ErrorMessage message={'nonempty'} margin={'112.3px'} />, container);
      });
      let style = window.getComputedStyle(getErrorMessage());
      expect(style.margin).toBe('112.3px');
    });
  });

  it('is zero by default', () => {
    act(() => {
      render(<ErrorMessage message={'asdf'} />, container);
    });
    let style = window.getComputedStyle(getErrorMessage());
    expect(style.margin).toBe('0px');
  });
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
