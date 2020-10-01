import * as React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';
import { fireEvent } from '@testing-library/react';
import TextField from './TextField';

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

function getComponent() {
  return container.childNodes[0];
}

function getLabel() {
  return getComponent().childNodes[0].childNodes[0];
}

function getInput() {
  return getComponent().childNodes[0].childNodes[1];
}

function getErrorMessage() {
  return getComponent().childNodes[1].childNodes[1];
}

it('renders name in label', () => {
  act(() => {
    render(<TextField name={'asdfQWER'} />, container);
  });
  expect(getLabel().textContent).toBe('asdfQWER:');
});

it('renders initial value in input element', () => {
  act(() => {
    render(<TextField initialValue={'qwezxcv'} />, container);
  });
  expect(getInput().value).toBe('qwezxcv');
});

it('sets initial value to empty string by default', () => {
  act(() => {
    render(<TextField />, container);
  });
  expect(getInput().value).toBe('');
});

it('input element can be typed into', () => {
  act(() => {
    render(<TextField initialValue={'asdf'} />, container);
  });
  let input = getInput();
  act(() => {
    fireEvent.change(input, { target: { value: 'zxc' } });
  });
  expect(input.value).toBe('zxc');
  act(() => {
    fireEvent.change(input, { target: { value: 'jjkl' } });
  });
  expect(input.value).toBe('jjkl');
});

it('shows error message returned by checkValue callback', () => {
  act(() => {
    render(<TextField checkValue={v => v == 'qwer' ? 'Bad value.' : ''} />, container);
  });
  expect(getErrorMessage().textContent).toBeFalsy();
  act(() => {
    fireEvent.change(getInput(), { target: { value: 'qwer' } });
  });
  expect(getErrorMessage().textContent).toBeTruthy();
});

it('removes any previous error message when checkValue callback returns none', () => {
  act(() => {
    render(<TextField checkValue={v => v == 'qwer' ? 'Bad value.' : ''} />, container);
  });
  expect(getErrorMessage().textContent).toBeFalsy();
  act(() => {
    fireEvent.change(getInput(), { target: { value: 'qwer' } });
  });
  expect(getErrorMessage().textContent).toBeTruthy();
  act(() => {
    fireEvent.change(getInput(), { target: { value: 'zxcv' } });
  });
  expect(getErrorMessage().textContent).toBeFalsy();
});

it('checkValue callback prop is optional', () => {
  act(() => {
    render(<TextField />, container);
  });
  act(() => fireEvent.change(getInput(), { target: { value: 'asdf' } }));
  act(() => fireEvent.change(getInput(), { target: { value: 'qwer' } }));
  act(() => fireEvent.change(getInput(), { target: { value: 'zxcv' } }));
  expect(getErrorMessage().textContent).toBeFalsy();
});

it('passes onFocus callback', () => {
  let onFocus = jest.fn();
  act(() => {
    render(<TextField initialValue={'asdf'} onFocus={onFocus} />, container);
  });
  expect(onFocus).not.toHaveBeenCalled();
  act(() => fireEvent.focus(getInput(), { bubbles: true }));
  expect(onFocus).toHaveBeenCalled();
});

it('calls onInput, onValidInput and onInvalidInput callbacks when appropriate', () => {
  let onInput = jest.fn();
  let onValidInput = jest.fn();
  let onInvalidInput = jest.fn();
  act(() => {
    render(
      <TextField
        checkValue={v => v == 'asdf' ? 'error' : ''}
        onInput={onInput}
        onValidInput={onValidInput}
        onInvalidInput={onInvalidInput}
      />,
      container,
    );
  });
  act(() => fireEvent.change(getInput(), { target: { value: 'asdf' } }));
  expect(onInput).toHaveBeenCalledTimes(1);
  expect(onValidInput).not.toHaveBeenCalled();
  expect(onInvalidInput).toHaveBeenCalledTimes(1);
  act(() => fireEvent.change(getInput(), { target: { value: 'qwer' } }));
  expect(onInput).toHaveBeenCalledTimes(2);
  expect(onValidInput).toHaveBeenCalledTimes(1);
  expect(onInvalidInput).toHaveBeenCalledTimes(1);
  act(() => fireEvent.change(getInput(), { target: { value: 'asdf' } }));
  expect(onInput).toHaveBeenCalledTimes(3);
  expect(onValidInput).toHaveBeenCalledTimes(1);
  expect(onInvalidInput).toHaveBeenCalledTimes(2);
  act(() => fireEvent.change(getInput(), { target: { value: 'asd' } }));
  expect(onInput).toHaveBeenCalledTimes(4);
  expect(onValidInput).toHaveBeenCalledTimes(2);
  expect(onInvalidInput).toHaveBeenCalledTimes(2);
});

describe('setting value', () => {
  it('sets on blur', () => {
    let set = jest.fn();
    act(() => {
      render(<TextField initialValue={'asdf'} set={set} />, container);
    });
    act(() => {
      fireEvent.blur(getInput());
    });
    expect(set).toHaveBeenCalled();
    expect(set.mock.calls[0][0]).toBe('asdf');
  });

  it('sets on enter key up', () => {
    let set = jest.fn();
    act(() => {
      render(<TextField initialValue={'zzxxcc'} set={set} />, container);
    });
    act(() => {
      fireEvent.keyUp(getInput(), { key: 'Enter' })
    });
    expect(set).toHaveBeenCalled();
    expect(set.mock.calls[0][0]).toBe('zzxxcc');
  });

  it('does not set when there is an error message', () => {
    let set = jest.fn();
    act(() => {
      render(
        <TextField
          checkValue={v => v == 'asd' ? 'Bad value.' : ''}
          set={set}
        />,
        container,
      );
      fireEvent.change(getInput(), { target: { value: 'asd' } });
    });
    // there is an error message
    expect(getErrorMessage().textContent).toBeTruthy();
    act(() => {
      fireEvent.blur(getInput());
    });
    expect(set).not.toHaveBeenCalled();
  });

  it('does not set when input is invalid even when there is no error message', () => {
    /* It is possible to have a blur event or enter key up event without there
    ever being a change event, meaning that the input may be invalid without there
    being an error message. */
    let set = jest.fn();
    act(() => {
      render(
        <TextField
          initialValue={'asd'}
          checkValue={v => v == 'asd' ? 'Bad value.' : ''}
          set={set}
        />,
        container,
      );
    });
    expect(getErrorMessage().textContent).toBeFalsy(); // no error message
    act(() => {
      fireEvent.blur(getInput());
    });
    expect(set).not.toHaveBeenCalled();
  });
});

describe('autoFocus', () => {
  it('is autofocused on rerender when enter key was pressed', () => {
    act(() => {
      render(<TextField initialValue={'asdf'} />, container);
      fireEvent.keyUp(getInput(), { key: 'Enter' });
    });
    act(() => unmountComponentAtNode(container));
    act(() => render(<TextField initialValue={'asdf'} />, container));
    expect(document.activeElement).toBe(getInput());
  });

  it('but not when blurred', () => {
    act(() => {
      render(<TextField initialValue={'asdf'} />, container);
      fireEvent.blur(getInput());
    });
    act(() => unmountComponentAtNode(container));
    act(() => render(<TextField initialValue={'asdf'} />, container));
    expect(document.activeElement).not.toBe(getInput());
  });
});
