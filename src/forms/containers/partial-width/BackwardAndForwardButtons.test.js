import * as React from 'react';
import { act } from 'react-dom/test-utils';
import { render } from 'react-dom';
import { unmountComponentAtNode } from 'react-dom';

import { BackwardAndForwardButtons } from './BackwardAndForwardButtons';

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

describe('BackwardAndForwardButtons component', () => {
  test('when can go backward and forward', () => {
    history.canGoBackward = jest.fn(() => true);
    history.canGoForward = jest.fn(() => true);
    act(() => {
      render(<BackwardAndForwardButtons {...history} />, container);
    });
    expect(container.childNodes.length).toBeGreaterThan(0); // renders
  });

  test('when can only go backward', () => {
    history.canGoBackward = jest.fn(() => true);
    history.canGoForward = jest.fn(() => false);
    act(() => {
      render(<BackwardAndForwardButtons {...history} />, container);
    });
    expect(container.childNodes.length).toBeGreaterThan(0); // renders
  });

  test('when can only go forward', () => {
    history.canGoBackward = jest.fn(() => false);
    history.canGoForward = jest.fn(() => true);
    act(() => {
      render(<BackwardAndForwardButtons {...history} />, container);
    });
    expect(container.childNodes.length).toBeGreaterThan(0); // renders
  });

  test('when cannot go backward or forward', () => {
    history.canGoBackward = jest.fn(() => false);
    history.canGoForward = jest.fn(() => false);
    act(() => {
      render(<BackwardAndForwardButtons {...history} />, container);
    });
    expect(container.childNodes.length).toBe(0); // does not render
  });
});
