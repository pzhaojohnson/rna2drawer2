import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';
import { fireEvent } from '@testing-library/react';
import { DroppedButton } from './DroppedButton';

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

function getButton(container) {
  return container.childNodes[0];
}

it('shows text', () => {
  act(() => {
    render(
      <DroppedButton text={'asdfasdf'} />,
      container,
    );
  });
  expect(container.textContent.includes('asdfasdf')).toBeTruthy();
});

it('binds onClick callback (by default)', () => {
  let onClick = jest.fn();
  act(() => {
    render(<DroppedButton onClick={onClick} />, container);
  });
  expect(onClick).not.toHaveBeenCalled();
  act(() => {
    fireEvent.click(getButton(container), { bubbles: true });
  });
  expect(onClick).toHaveBeenCalled();
});

it('shows key binding', () => {
  act(() => {
    render(<DroppedButton keyBinding={'Ctrl-A'} />, container);
  });
  expect(container.textContent.includes('Ctrl-A')).toBeTruthy();
});

it('can be checked', () => {
  act(() => {
    render(<DroppedButton checked={true} />, container);
  });
  let imgs = container.getElementsByTagName('img');
  expect(imgs[0].alt).toBe('Checkmark');
});

it('is not checked by default', () => {
  act(() => {
    render(<DroppedButton />, container);
  });
  let imgs = container.getElementsByTagName('img');
  expect(imgs.length).toBe(0);
});

it('renders with border attributes', () => {
  act(() => {
    render(
      <DroppedButton
        borderStyle={'solid'}
        borderColor={'#1234ab'}
        borderWidth={'11px'}
      />,
      container,
    );
  });
  let b = getButton(container);
  expect(b.style.borderStyle).toBe('solid');
  expect(b.style.borderColor).toBe('#1234ab');
  expect(b.style.borderWidth).toBe('11px');
});

describe('when disabled', () => {
  it('does not bind onClick callback', () => {
    let onClick = jest.fn();
    act(() => {
      render(
        <DroppedButton onClick={onClick} disabled={true} />,
        container,
      );
      fireEvent
    });
    act(() => {
      fireEvent.click(getButton(container), { bubbles: true });
    });
    expect(onClick).not.toHaveBeenCalled();
  });

  it('changes color', () => {
    act(() => {
      render(<DroppedButton disabled={true} />, container);
    });
    let b = getButton(container);
    expect(b.style.color).toBe('rgba(0, 0, 0, 0.4)');
  });
});
