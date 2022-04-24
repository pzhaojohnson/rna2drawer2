import * as React from 'react';
import { act } from 'react-dom/test-utils';
import { render } from 'react-dom';
import { unmountComponentAtNode } from 'react-dom';

import { FieldLabel } from './FieldLabel';

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

describe('FieldLabel component', () => {
  it('renders with specified children', () => {
    act(() => {
      render(
        <FieldLabel>
          Asdf qwer.
          <input type='text' value='123455555' />
        </FieldLabel>,
        container,
      );
    });
    expect(container.textContent).toMatch(/Asdf qwer./);
    let textInput = container.getElementsByTagName('input')[0];
    expect(textInput).toBeTruthy();
    expect(textInput.value).toBe('123455555');
  });

  it('renders with specified for attribute', () => {
    act(() => {
      render(<FieldLabel htmlFor='zzXXcQ' />, container);
    });
    expect(container.firstChild.htmlFor).toBe('zzXXcQ');
  });

  it('renders with specified CSS styles', () => {
    act(() => {
      render(<FieldLabel style={{ marginTop: '88.12px' }} />, container);
    });
    expect(container.firstChild.style.marginTop).toBe('88.12px');
  });
});
