import * as React from 'react';
import { act } from 'react-dom/test-utils';
import { render } from 'react-dom';
import { Simulate } from 'react-dom/test-utils';
import { unmountComponentAtNode } from 'react-dom';

import { BackwardButton } from './BackwardButton';

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

describe('BackwardButton component', () => {
  describe('when can go backward', () => {
    it('has enabled CSS styles', () => {
      history.canGoBackward = jest.fn(() => true);
      act(() => {
        render(<BackwardButton {...history} />, container);
      });
      expect(container.firstChild.className).toMatch(/enabled/);
      expect(container.firstChild.className).not.toMatch(/disabled/);
    });

    it('calls goBackward callback on click', () => {
      history.canGoBackward = jest.fn(() => true);
      act(() => {
        render(<BackwardButton {...history} />, container);
      });
      expect(history.goBackward).not.toHaveBeenCalled();
      Simulate.click(container.firstChild);
      expect(history.goBackward).toHaveBeenCalledTimes(1);
      // did not mix up backward and forward callbacks
      expect(history.goForward).not.toHaveBeenCalled();
    });
  });

  describe('when cannot go backward', () => {
    it('has disabled CSS styles', () => {
      history.canGoBackward = jest.fn(() => false);
      act(() => {
        render(<BackwardButton {...history} />, container);
      });
      expect(container.firstChild.className).toMatch(/disabled/);
      expect(container.firstChild.className).not.toMatch(/enabled/);
    });

    it('does nothing on click', () => {
      history.canGoBackward = jest.fn(() => false);
      act(() => {
        render(<BackwardButton {...history} />, container);
      });
      Simulate.click(container.firstChild);
      expect(history.goBackward).not.toHaveBeenCalled();
      expect(history.goForward).not.toHaveBeenCalled();
    });
  });
});
