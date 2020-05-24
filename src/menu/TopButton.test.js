import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';

import TopButton from './TopButton';

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

function getTopButton() {
  return container.childNodes[0];
}

it('when enabled', () => {
  act(() => {
    render(
      <TopButton
        backgroundColor={'cyan'}
        text={'asdfasdf'}
        disabled={false}
        buttonColor={'brown'}
        disabledButtonColor={'gray'}
      />,
      container,
    );
  });
  let tb = getTopButton();
  expect(tb.style.backgroundColor).toBe('cyan');
  expect(tb.textContent).toBe('asdfasdf');
  expect(tb.style.color).toBe('brown');
});

it('when disabled', () => {
  act(() => {
    render(
      <TopButton
        backgroundColor={'beige'}
        text={'qwerqwer'}
        disabled={true}
        buttonColor={'black'}
        disabledButtonColor={'pink'}
      />,
      container,
    );
  });
  let tb = getTopButton();
  expect(tb.style.backgroundColor).toBe('beige');
  expect(tb.textContent).toBe('qwerqwer');
  expect(tb.style.color).toBe('pink');
});
