import * as React from 'react';
import { act } from 'react-dom/test-utils';
import { render } from 'react-dom';
import { Simulate } from 'react-dom/test-utils';
import { unmountComponentAtNode } from 'react-dom';

import { TextArea } from './TextArea';

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

describe('TextArea component', () => {
  it('renders with specified value', () => {
    act(() => {
      render(<TextArea value='11qQwx cnv' />, container);
    });
    expect(container.firstChild.value).toBe('11qQwx cnv');
  });

  it('passes onChange callback to the underlying textarea element', () => {
    let onChange = jest.fn();
    act(() => {
      render(<TextArea onChange={onChange} />, container);
    });
    expect(onChange).not.toHaveBeenCalled();
    act(() => {
      container.firstChild.value = 'kkQWER zxcv';
      Simulate.change(container.firstChild);
    });
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange.mock.calls[0][0].target).toBe(container.firstChild);
    expect(onChange.mock.calls[0][0].target.value).toBe('kkQWER zxcv');
  });

  it('passes onBlur callback to the underlying textarea element', () => {
    let onBlur = jest.fn();
    act(() => {
      render(<TextArea onBlur={onBlur} />, container);
    });
    expect(onBlur).not.toHaveBeenCalled();
    act(() => {
      Simulate.blur(container.firstChild);
    });
    expect(onBlur).toHaveBeenCalledTimes(1);
    expect(onBlur.mock.calls[0][0].target).toBe(container.firstChild);
  });

  it('renders with specified number of rows', () => {
    act(() => {
      render(<TextArea rows={63} />, container);
    });
    expect(container.firstChild.rows).toBe(63);
  });

  it('renders with specified CSS styles', () => {
    act(() => {
      render(<TextArea style={{ marginTop: '18.07px' }} />, container);
    });
    expect(container.firstChild.style.marginTop).toBe('18.07px');
  });
});
