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
    let input = container.getElementsByTagName('input')[0];
    expect(input.value).toBe('-123.08');
  });

  it('passes onChange callback to the text input element', () => {
    let onChange = jest.fn();
    act(() => {
      render(<TextInputField onChange={onChange} />, container);
    });
    expect(onChange).not.toHaveBeenCalled();
    let input = container.getElementsByTagName('input')[0];
    act(() => {
      input.value = 'zxcvQWER1234';
      Simulate.change(input);
    });
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange.mock.calls[0][0].target).toBe(input);
    expect(onChange.mock.calls[0][0].target.value).toBe('zxcvQWER1234');
  });

  it('passes onBlur callback to the text input element', () => {
    let onBlur = jest.fn();
    act(() => {
      render(<TextInputField onBlur={onBlur} />, container);
    });
    expect(onBlur).not.toHaveBeenCalled();
    let input = container.getElementsByTagName('input')[0];
    act(() => {
      Simulate.blur(input);
    });
    expect(onBlur).toHaveBeenCalledTimes(1);
    expect(onBlur.mock.calls[0][0].target).toBe(input);
  });

  it('passes onKeyUp callback to the text input element', () => {
    let onKeyUp = jest.fn();
    act(() => {
      render(<TextInputField onKeyUp={onKeyUp} />, container);
    });
    expect(onKeyUp).not.toHaveBeenCalled();
    let input = container.getElementsByTagName('input')[0];
    act(() => {
      Simulate.keyUp(input, { key: 'Enter' });
    });
    expect(onKeyUp).toHaveBeenCalledTimes(1);
    expect(onKeyUp.mock.calls[0][0].target).toBe(input);
    expect(onKeyUp.mock.calls[0][0].key).toBe('Enter');
  });

  it('renders with specified input element ID', () => {
    act(() => {
      render(<TextInputField input={{ id: 'ASDF qw1234' }} />, container);
    });
    let input = container.getElementsByTagName('input')[0];
    expect(input.id).toBe('ASDF qw1234');
  });

  it('passes specified placeholder text to the input element', () => {
    act(() => {
      render(<TextInputField input={{ placeholder: 'Blah bleh zxcv.' }} />, container);
    });
    let input = container.getElementsByTagName('input')[0];
    expect(input.placeholder).toBe('Blah bleh zxcv.');
  });

  it('passes specified spellCheck attribute to the input element', () => {
    act(() => {
      render(<TextInputField input={{ spellCheck: true }} />, container);
    });
    let input = container.getElementsByTagName('input')[0];
    // simply checking spellcheck property on input element doesn't seem to work
    expect(input.outerHTML).toMatch(/spellcheck="true"/);
    act(() => {
      render(<TextInputField input={{ spellCheck: false }} />, container);
    });
    input = container.getElementsByTagName('input')[0];
    expect(input.outerHTML).toMatch(/spellcheck="false"/);
  });

  it('renders with specified CSS styles', () => {
    act(() => {
      render(<TextInputField style={{ marginTop: '32.58px' }} />, container);
    });
    expect(container.firstChild.style.marginTop).toBe('32.58px');
  });

  it('passes specified CSS styles to the text input element', () => {
    act(() => {
      render(<TextInputField input={{ style: { width: '18.22px' } }} />, container);
    });
    let input = container.getElementsByTagName('input')[0];
    expect(input.style.width).toBe('18.22px');
  });
});
