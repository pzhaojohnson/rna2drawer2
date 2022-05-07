import * as React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';
import { fireEvent } from '@testing-library/react';
import { TextButton } from './TextButton';

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

describe('TextButton component', () => {
  it('renders with given text', () => {
    act(() => {
      render(<TextButton text='asdf QWERqwer' />, container);
    });
    expect(container.textContent).toMatch(/asdf QWERqwer/);
  });

  it('binds given onClick callback', () => {
    let onClick = jest.fn();
    act(() => {
      render(<TextButton onClick={onClick} />, container);
    });
    expect(onClick).not.toHaveBeenCalled();
    act(() => {
      fireEvent(
        container.childNodes[0],
        new MouseEvent('click', { bubbles: true })
      );
    });
    expect(onClick).toHaveBeenCalled();
  });

  it('renders with specified CSS styles', () => {
    act(() => {
      render(<TextButton style={{ margin: '8px 0px 0px 2.5px' }} />, container);
    });
    expect(container.firstChild.style.margin).toBe('8px 0px 0px 2.5px');
  });
});
