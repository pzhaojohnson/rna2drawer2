import * as React from 'react';
import { act } from 'react-dom/test-utils';
import { render } from 'react-dom';
import { unmountComponentAtNode } from 'react-dom';

import { DottedNote } from './DottedNote';

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

test('DottedNote component', () => {
  expect(container.textContent).toBe('');
  act(() => {
    render(
      <DottedNote>Asdf qwer zxcv.</DottedNote>,
      container,
    );
  });
  expect(container.textContent).toBe('Asdf qwer zxcv.');
  act(() => {
    render(
      <DottedNote>
        <p>A paragraph and <span>span</span> note.</p>
      </DottedNote>,
      container,
    );
  });
  expect(container.textContent).toBe('A paragraph and span note.');
});
