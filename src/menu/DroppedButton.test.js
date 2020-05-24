import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';

import DroppedButton from './DroppedButton';

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

function getDroppedButton() {
  return container.childNodes[0];
}

function getButtonItems() {
  let db = getDroppedButton();
  return db.childNodes[0];
}

function getButtonText() {
  let bis = getButtonItems();
  return bis.childNodes[0].textContent;
}

function getKeyBinding() {
  let bis = getButtonItems();
  return bis.childNodes[1].textContent;
}

function getCheckMark() {
  let bis = getButtonItems();
  return bis.childNodes[2];
}

it('renders with text', () => {
  act(() => {
    render(
      <DroppedButton
        text={'asdfasdf'}
      />,
      container,
    );
  });
  expect(getButtonText()).toBe('asdfasdf');
});

it('when disabled', () => {
  let onClick = jest.fn();
  act(() => {
    render(
      <DroppedButton
        onClick={onClick}
        backgroundColor={'beige'}
        disabled={true}
        buttonColor={'black'}
        disabledButtonColor={'yellow'}
      />,
      container,
    );
  });
  let db = getDroppedButton();
  act(() => {
    db.dispatchEvent(
      new Event('click', { bubbles: true })
    );
  });
  expect(onClick.mock.calls.length).toBe(0);
  expect(db.style.backgroundColor).toBe('beige');
  expect(db.style.color).toBe('yellow');
});

it('when enabled', () => {
  let onClick = jest.fn();
  act(() => {
    render(
      <DroppedButton
        onClick={onClick}
        backgroundColor={'beige'}
        disabled={false}
        buttonColor={'brown'}
        disabledButtonColor={'yellow'}
      />,
      container,
    );
  });
  let db = getDroppedButton();
  act(() => {
    db.dispatchEvent(
      new Event('click', { bubbles: true })
    );
  });
  expect(onClick.mock.calls.length).toBe(1);

  /* This allows the background color to change on hover,
  as specified in src/App.css. */
  expect(db.style.backgroundColor).toBeFalsy();
  
  expect(db.style.color).toBe('brown');
});

it('with key binding', () => {
  act(() => {
    render(
      <DroppedButton
        keyBinding={'Ctrl+A'}
      />,
      container,
    );
  });
  expect(getKeyBinding()).toBe('Ctrl+A');
});

it('without key binding', () => {
  act(() => {
    render(<DroppedButton />, container);
  });
  expect(getKeyBinding()).toBeFalsy();
});

it('checked', () => {
  act(() => {
    render(
      <DroppedButton
        checked={true}
      />,
      container,
    );
  });
  expect(getCheckMark()).toBeTruthy();
});

it('unchecked', () => {
  act(() => {
    render(<DroppedButton />, container);
  });
  expect(getCheckMark()).toBeFalsy();
});
