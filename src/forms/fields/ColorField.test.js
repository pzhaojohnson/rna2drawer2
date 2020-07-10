import * as React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';
import { fireEvent } from '@testing-library/react';
import ColorField from './ColorField';

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

function getInput() {
  return getComponent().childNodes[0];
}

function getLabel() {
  return getComponent().childNodes[1];
}

it('renders with given name', () => {
  act(() => {
    render(<ColorField name={'qwer zxcv'} />, container);
  });
  expect(getLabel().textContent).toBe('qwer zxcv');
});

it('renders with given initial value', () => {
  act(() => {
    render(<ColorField initialValue={'#24abf1'} />, container);
  });
  expect(getInput().value).toBe('#24abf1');
});

it('can render with a default value', () => {
  act(() => {
    render(<ColorField />, container);
  });
  expect(getInput().value).toBe('#000000');
});

it('handler for change event changes state', () => {
  act(() => {
    render(<ColorField initialValue={'#000000'} set={() => {}} />, container);
    fireEvent.change(getInput(), { target: { value: '#123456' } });
  });
  expect(getInput().value).toBe('#123456');
  act(() => {
    fireEvent.change(getInput(), { target: { value: '#abfe16' } });
  });
  expect(getInput().value).toBe('#abfe16');
  act(() => {
    fireEvent.change(getInput(), { target: { value: '#0012bb' } });
  });
  expect(getInput().value).toBe('#0012bb');
});

it('change event does not cause set callback to be called', () => {
  let set = jest.fn();
  act(() => {
    render(<ColorField initialValue={'#000000'} set={set} />, container);
    fireEvent.change(getInput(), { target: { value: '#abcdef' } });
  });
  expect(getInput().value).toBe('#abcdef'); // value was changed
  expect(set).not.toHaveBeenCalled();
});

it('does not call set callback on first focus event', () => {
  let set = jest.fn();
  act(() => {
    render(<ColorField initialValue={'#123234'} set={set} />, container);
  });
  act(() => fireEvent.focus(getInput()));
  expect(set).not.toHaveBeenCalled();
});

describe('handling of a focus event after a blur event', () => {
  it('calls set callback if value changed', () => {
    let set = jest.fn();
    act(() => {
      render(<ColorField initialValue={'#1123ba'} set={set} />, container);
    });
    act(() => fireEvent.focus(getInput()));
    act(() => fireEvent.blur(getInput()));
    expect(set).not.toHaveBeenCalled(); // value has yet to change
    act(() => fireEvent.change(getInput(), { target: { value: '#aabbcc' } }));
    act(() => fireEvent.focus(getInput()));
    expect(set).toHaveBeenCalled();
    expect(set.mock.calls[0][0]).toBe('#aabbcc');
  });

  it('but not when value stayed the same', () => {
    let set = jest.fn();
    act(() => {
      render(<ColorField initialValue={'#123123'} set={set} />, container);
    });
    act(() => fireEvent.focus(getInput()));
    act(() => fireEvent.blur(getInput()));
    expect(set).not.toHaveBeenCalled(); // value has yet to change
    act(() => fireEvent.change(getInput(), { target: { value: '#123123' } }));
    act(() => fireEvent.focus(getInput()));
    expect(set).not.toHaveBeenCalled();
  });
});

describe('handling of a blur event after a focus event', () => {
  it('calls set callback if value changed', () => {
    let set = jest.fn();
    act(() => {
      render(<ColorField initialValue={'#112266'} set={set} />, container);
    });
    act(() => fireEvent.focus(getInput()));
    expect(set).not.toHaveBeenCalled(); // value has yet to change
    act(() => fireEvent.change(getInput(), { target: { value: '#662211' } }));
    act(() => fireEvent.blur(getInput()));
    expect(set).toHaveBeenCalled();
    expect(set.mock.calls[0][0]).toBe('#662211');
  });

  it('but not when value stayed the same', () => {
    let set = jest.fn();
    act(() => {
      render(<ColorField initialValue={'#332211'} set={set} />, container);
    });
    fireEvent.focus(getInput());
    expect(set).not.toHaveBeenCalled(); // value has yet to change
    act(() => fireEvent.change(getInput(), { target: { value: '#332211' } }));
    act(() => fireEvent.blur(getInput()));
    expect(set).not.toHaveBeenCalled();
  });
});
