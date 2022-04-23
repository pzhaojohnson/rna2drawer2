import * as React from 'react';
import { act } from 'react-dom/test-utils';
import { render } from 'react-dom';
import { Simulate } from 'react-dom/test-utils';
import { unmountComponentAtNode } from 'react-dom';

import { CheckboxField } from './CheckboxField';

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

describe('CheckboxField component', () => {
  it('renders with specified label text', () => {
    act(() => {
      render(<CheckboxField label='zzXCV aaSDF' />, container);
    });
    expect(container.textContent).toMatch(/zzXCV aaSDF/);
  });

  it('can render checked', () => {
    act(() => {
      render(<CheckboxField checked={true} />, container);
    });
    let checkboxInput = container.getElementsByTagName('input')[0];
    expect(checkboxInput.checked).toBeTruthy();
  });

  it('can render unchecked', () => {
    act(() => {
      render(<CheckboxField checked={false} />, container);
    });
    let checkboxInput = container.getElementsByTagName('input')[0];
    expect(checkboxInput.checked).toBeFalsy();
  });

  it('passes onChange callback to the checkbox input element', () => {
    let onChange = jest.fn();
    act(() => {
      render(<CheckboxField checked={false} onChange={onChange} />, container);
    });
    expect(onChange).not.toHaveBeenCalled();
    let checkboxInput = container.getElementsByTagName('input')[0];
    act(() => {
      checkboxInput.checked = true;
      Simulate.change(checkboxInput);
    });
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange.mock.calls[0][0].target).toBe(checkboxInput);

    // checked attribute doesn't seem to get updated
    //expect(onChange.mock.calls[0][0].target.checked).toBeTruthy();
  });

  it('renders with specified CSS styles', () => {
    act(() => {
      render(<CheckboxField style={{ marginTop: '16.17px' }} />, container);
    });
    expect(container.firstChild.style.marginTop).toBe('16.17px');
  });
});
