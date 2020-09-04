import * as React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';
import { fireEvent } from '@testing-library/react';
import { ActionButton } from './ActionButton';

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

it('has enabled CSS styles when enabled', () => {
  let b = ActionButton({});
  expect(b.props.className).toBe('action-button');
});

it('renders text', () => {
  act(() => render(<ActionButton text={'Asdf Qwer'} />, container));
  expect(container.textContent.includes('Asdf Qwer')).toBeTruthy();
});

it('binds onClick callback', () => {
  let onClick = jest.fn();
  act(() => render(<ActionButton onClick={onClick} />, container));
  expect(onClick).not.toHaveBeenCalled();
  act(() => {
    fireEvent(
      container.childNodes[0],
      new MouseEvent('click', { bubbles: true })
    );
  });
  expect(onClick).toHaveBeenCalled();
});

describe('when disabled', () => {
  it('has disabled CSS styles', () => {
    let b = ActionButton({ disabled: true });
    expect(b.props.className).toBe('disabled-action-button');
  });

  it('does not bind onClick callback', () => {
    let onClick = jest.fn();
    act(() => render(<ActionButton onClick={onClick} disabled={true} />, container));
    act(() => {
      fireEvent(
        container.childNodes[0],
        new MouseEvent('click', { bubbles: true })
      );
    });
    expect(onClick).not.toHaveBeenCalled();
  });
});
