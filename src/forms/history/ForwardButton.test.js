import * as React from 'react';
import { act } from 'react-dom/test-utils';
import { render } from 'react-dom';
import { Simulate } from 'react-dom/test-utils';
import { unmountComponentAtNode } from 'react-dom';

import { ForwardButton } from './ForwardButton';

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

describe('ForwardButton component', () => {
  describe('when can go forward', () => {
    it('has enabled CSS styles', () => {
      history.canGoForward = jest.fn(() => true);
      act(() => {
        render(<ForwardButton {...history} />, container);
      });
      expect(container.firstChild.className).toMatch(/enabled/);
      expect(container.firstChild.className).not.toMatch(/disabled/);
    });

    it('calls goForward callback on click', () => {
      history.canGoForward = jest.fn(() => true);
      act(() => {
        render(<ForwardButton {...history} />, container);
      });
      expect(history.goForward).not.toHaveBeenCalled();
      Simulate.click(container.firstChild);
      expect(history.goForward).toHaveBeenCalledTimes(1);
      // did not mix up backward and forward callbacks
      expect(history.goBackward).not.toHaveBeenCalled();
    });
  });

  describe('when cannot go forward', () => {
    it('has disabled CSS styles', () => {
      history.canGoForward = jest.fn(() => false);
      act(() => {
        render(<ForwardButton {...history} />, container);
      });
      expect(container.firstChild.className).toMatch(/disabled/);
      expect(container.firstChild.className).not.toMatch(/enabled/);
    });

    it('does nothing on click', () => {
      history.canGoForward = jest.fn(() => false);
      act(() => {
        render(<ForwardButton {...history} />, container);
      });
      Simulate.click(container.firstChild);
      expect(history.goForward).not.toHaveBeenCalled();
      expect(history.goBackward).not.toHaveBeenCalled();
    });
  });
});
