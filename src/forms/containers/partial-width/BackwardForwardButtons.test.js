import * as React from 'react';
import { act } from 'react-dom/test-utils';
import { render } from 'react-dom';
import { unmountComponentAtNode } from 'react-dom';

import { BackwardForwardButtons } from './BackwardForwardButtons';

let history = null;

let container = null;

beforeEach(() => {
  history = {
    goBackward: jest.fn(),
    canGoBackward: jest.fn(() => false),
    goForward: jest.fn(),
    canGoForward: jest.fn(() => false),
  };

  container = document.createElement('div');
  document.body.appendChild(container);
});

afterEach(() => {
  unmountComponentAtNode(container);
  container.remove();
  container = null;

  history = null;
});

describe('BackwardForwardButtons component', () => {
  test('when can go backward and forward', () => {
    history.canGoBackward = jest.fn(() => true);
    history.canGoForward = jest.fn(() => true);
    act(() => {
      render(<BackwardForwardButtons {...history} />, container);
    });
    expect(container.childNodes.length).toBeGreaterThan(0);
  });

  test('when can only go backward', () => {
    history.canGoBackward = jest.fn(() => true);
    history.canGoForward = jest.fn(() => false);
    act(() => {
      render(<BackwardForwardButtons {...history} />, container);
    });
    expect(container.childNodes.length).toBeGreaterThan(0);
  });

  test('when can only go forward', () => {
    history.canGoBackward = jest.fn(() => false);
    history.canGoForward = jest.fn(() => true);
    act(() => {
      render(<BackwardForwardButtons {...history} />, container);
    });
    expect(container.childNodes.length).toBeGreaterThan(0);
  });

  test('when cannot go backward or forward', () => {
    history.canGoBackward = jest.fn(() => false);
    history.canGoForward = jest.fn(() => false);
    act(() => {
      render(<BackwardForwardButtons {...history} />, container);
    });
    expect(container.childNodes.length).toBe(0);
  });
});
