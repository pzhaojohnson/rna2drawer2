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
