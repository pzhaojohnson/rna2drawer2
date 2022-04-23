import * as React from 'react';
import { act } from 'react-dom/test-utils';
import { render } from 'react-dom';
import { Simulate } from 'react-dom/test-utils';
import { unmountComponentAtNode } from 'react-dom';

import { TextInputField } from './TextInputField';

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

describe('TextInputField component', () => {
  it('renders with specified label text', () => {
    act(() => {
      render(<TextInputField label='Asdf QWER' />, container);
    });
    expect(container.textContent).toMatch(/Asdf QWER/);
  });

  it('passes value to the text input element', () => {
    act(() => {
      render(<TextInputField value='-123.08' />, container);
    });
    let textInput = container.getElementsByTagName('input')[0];
    expect(textInput.value).toBe('-123.08');
  });

  it('passes onChange callback to the text input element', () => {
    let onChange = jest.fn();
    act(() => {
      render(<TextInputField onChange={onChange} />, container);
    });
    expect(onChange).not.toHaveBeenCalled();
    let textInput = container.getElementsByTagName('input')[0];
    act(() => {
      textInput.value = 'zxcvQWER1234';
      Simulate.change(textInput);
    });
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange.mock.calls[0][0].target).toBe(textInput);
    expect(onChange.mock.calls[0][0].target.value).toBe('zxcvQWER1234');
  });

  it('passes onBlur callback to the text input element', () => {
    let onBlur = jest.fn();
    act(() => {
      render(<TextInputField onBlur={onBlur} />, container);
    });
    expect(onBlur).not.toHaveBeenCalled();
    let textInput = container.getElementsByTagName('input')[0];
    act(() => {
      Simulate.blur(textInput);
    });
    expect(onBlur).toHaveBeenCalledTimes(1);
    expect(onBlur.mock.calls[0][0].target).toBe(textInput);
  });

  it('passes onKeyUp callback to the text input element', () => {
    let onKeyUp = jest.fn();
    act(() => {
      render(<TextInputField onKeyUp={onKeyUp} />, container);
    });
    expect(onKeyUp).not.toHaveBeenCalled();
    let textInput = container.getElementsByTagName('input')[0];
    act(() => {
      Simulate.keyUp(textInput, { key: 'Enter' });
    });
    expect(onKeyUp).toHaveBeenCalledTimes(1);
    expect(onKeyUp.mock.calls[0][0].target).toBe(textInput);
    expect(onKeyUp.mock.calls[0][0].key).toBe('Enter');
  });

  it('renders with specified CSS styles', () => {
    act(() => {
      render(<TextInputField style={{ marginTop: '32.58px' }} />, container);
    });
    expect(container.firstChild.style.marginTop).toBe('32.58px');
  });

  it('passes specified CSS styles to the text input element', () => {
    act(() => {
      render(<TextInputField textInput={{ style: { width: '18.22px' } }} />, container);
    });
    let textInput = container.getElementsByTagName('input')[0];
    expect(textInput.style.width).toBe('18.22px');
  });
});
