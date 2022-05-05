import * as React from 'react';
import { act } from 'react-dom/test-utils';
import { render } from 'react-dom';
import { Simulate } from 'react-dom/test-utils';
import { unmountComponentAtNode } from 'react-dom';

import { TextInput } from './TextInput';

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

describe('TextInput component', () => {
  it('renders with specified value', () => {
    act(() => {
      render(<TextInput value='1234 zzxx' />, container);
    });
    expect(container.firstChild.value).toBe('1234 zzxx');
  });

  it('passes onChange callback to the underlying text input element', () => {
    let onChange = jest.fn();
    act(() => {
      render(<TextInput onChange={onChange} />, container);
    });
    expect(onChange).not.toHaveBeenCalled();
    act(() => {
      container.firstChild.value = 'mmNqQw123';
      Simulate.change(container.firstChild);
    });
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange.mock.calls[0][0].target).toBe(container.firstChild);
    expect(onChange.mock.calls[0][0].target.value).toBe('mmNqQw123');
  });

  it('passes onBlur callback to the underlying text input element', () => {
    let onBlur = jest.fn();
    act(() => {
      render(<TextInput onBlur={onBlur} />, container);
    });
    expect(onBlur).not.toHaveBeenCalled();
    act(() => {
      Simulate.blur(container.firstChild);
    });
    expect(onBlur).toHaveBeenCalledTimes(1);
    expect(onBlur.mock.calls[0][0].target).toBe(container.firstChild);
  });

  it('passes onKeyUp callback to the underlying text input element', () => {
    let onKeyUp = jest.fn();
    act(() => {
      render(<TextInput onKeyUp={onKeyUp} />, container);
    });
    expect(onKeyUp).not.toHaveBeenCalled();
    act(() => {
      Simulate.keyUp(container.firstChild, { key: 'Enter' });
    });
    expect(onKeyUp).toHaveBeenCalledTimes(1);
    expect(onKeyUp.mock.calls[0][0].target).toBe(container.firstChild);
    expect(onKeyUp.mock.calls[0][0].key).toBe('Enter');
  });

  it('renders with specified placeholder text', () => {
    act(() => {
      render(<TextInput placeholder='plok zxCV.' />, container);
    });
    expect(container.firstChild.placeholder).toBe('plok zxCV.');
  });

  it('renders with specified spellCheck attribute', () => {
    act(() => {
      render(<TextInput spellCheck={true} />, container);
    });
    // simply checking spellcheck property on input element doesn't seem to work
    expect(container.firstChild.outerHTML).toMatch(/spellcheck="true"/);
    act(() => {
      render(<TextInput spellCheck={false} />, container);
    });
    expect(container.firstChild.outerHTML).toMatch(/spellcheck="false"/);
  });

  it('renders with specified CSS styles', () => {
    act(() => {
      render(<TextInput style={{ marginRight: '6.92px' }} />, container);
    });
    expect(container.firstChild.style.marginRight).toBe('6.92px');
  });
});
