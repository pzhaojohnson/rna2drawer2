import * as React from 'react';

import { render } from 'react-dom';
import { unmountComponentAtNode } from 'react-dom';

import { act } from 'react-dom/test-utils';
import { Simulate } from 'react-dom/test-utils';

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
  it('renders with specified ID', () => {
    act(() => {
      render(<TextInput id='1223xxZY' />, container);
    });
    expect(container.firstChild.id).toBe('1223xxZY');
  });

  it('renders with specified value', () => {
    act(() => {
      render(<TextInput value='1234 zzxx' />, container);
    });
    expect(container.firstChild.value).toBe('1234 zzxx');
  });

  it('renders when value is not specified', () => {
    act(() => {
      render(<TextInput />, container);
    });
    expect(container.firstChild.value).toBe('');
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

  describe('style prop', () => {
    test('some non-font properties', () => {
      let style = {
        marginRight: '6.92px',
        minWidth: '219px',
      };
      act(() => render(<TextInput style={style} />, container));
      expect(container.firstChild.style.marginRight).toBe('6.92px');
      expect(container.firstChild.style.minWidth).toBe('219px');
    });

    test('when font properties are specified', () => {
      let style = {
        fontFamily: 'Courier New',
        fontSize: '37px',
        fontWeight: 'lighter',
        fontStyle: 'oblique',
      };
      act(() => render(<TextInput style={style} />, container));
      expect(container.firstChild.style.fontFamily).toBe('Courier New');
      expect(container.firstChild.style.fontSize).toBe('37px');
      expect(container.firstChild.style.fontWeight).toBe('lighter');
      expect(container.firstChild.style.fontStyle).toBe('oblique');
    });

    test('when font properties are not specified', () => {
      act(() => render(<TextInput />, container));
      // check default values
      let style = container.firstChild.style;
      expect(style.fontFamily).toBe('"Open Sans", sans-serif');
      expect(style.fontSize).toBe('12px');
      expect(style.fontWeight).toBe('500');
      expect(style.fontStyle).toBe('normal');
    });

    test('when width is specified', () => {
      act(() => render(<TextInput style={{ width: '152px' }} />, container));
      // renders with the specified width
      expect(container.firstChild.style.width).toBe('152px');
    });

    test('when width is not specified', () => {
      act(() => render(<TextInput value='asdfASDf' />, container));
      // should use measureTextWidth function to determine width
      // (which always seems to return zero on Node.js...)
      expect(container.firstChild.style.width).toBe('0px');
    });
  });
});
