import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';
import { fireEvent } from '@testing-library/react';
import { DataRangeField } from './DataRangeField';

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

function getMinInput() {
  return container.getElementsByTagName('input')[0];
}

function getMaxInput() {
  return container.getElementsByTagName('input')[1];
}

describe('min field', () => {
  it('only allows input less than or equal to max', () => {
    let onInput = jest.fn();
    let onValidInput = jest.fn();
    let onInvalidInput = jest.fn();
    let set = jest.fn();
    act(() => {
      render(
        <DataRangeField
          initialValue={{ min: 0, max: 1 }}
          onInput={onInput}
          onValidInput={onValidInput}
          onInvalidInput={onInvalidInput}
          set={set}
        />,
        container,
      );
    });

    act(() => fireEvent.change(getMinInput(), { target: { value: '0.25' } })); // less than max
    expect(onInput).toHaveBeenCalledTimes(1);
    expect(onValidInput).toHaveBeenCalledTimes(1);
    expect(onInvalidInput).not.toHaveBeenCalled();
    act(() => fireEvent.blur(getMinInput(), { bubbles: true }));
    expect(set.mock.calls[0][0]).toStrictEqual({ min: 0.25, max: 1 });

    act(() => fireEvent.change(getMinInput(), { target: { value: '1' } })); // equal to max
    expect(onInput).toHaveBeenCalledTimes(2);
    expect(onValidInput).toHaveBeenCalledTimes(2);
    expect(onInvalidInput).not.toHaveBeenCalled();
    act(() => fireEvent.blur(getMinInput(), { bubbles: true }));
    expect(set.mock.calls[1][0]).toStrictEqual({ min: 1, max: 1 });

    act(() => fireEvent.change(getMinInput(), { target: { value: '2' } })); // greater than max
    expect(onInput).toHaveBeenCalledTimes(3);
    expect(onValidInput).toHaveBeenCalledTimes(2);
    expect(onInvalidInput).toHaveBeenCalledTimes(1);
    act(() => fireEvent.blur(getMinInput(), { bubbles: true }));
    expect(set).toHaveBeenCalledTimes(2);
  });

  it('is reset to initial value when max field is focused and current value is invalid', () => {
    let onInput = jest.fn();
    let onValidInput = jest.fn();
    let set = jest.fn();
    act(() => {
      render(
        <DataRangeField
          initialValue={{ min: 0, max: 1 }}
          onInput={onInput}
          onValidInput={onValidInput}
          set={set}
        />,
        container,
      );
    });
    act(() => fireEvent.change(getMinInput(), { target: { value: '2' } })); // greater than max
    expect(getMinInput().value).toBe('2');
    expect(onInput).toHaveBeenCalledTimes(1);
    expect(onValidInput).toHaveBeenCalledTimes(0);
    act(() => fireEvent.focus(getMaxInput(), { bubbles: true }));
    expect(getMinInput().value).toBe('0');
    expect(onInput).toHaveBeenCalledTimes(2);
    expect(onValidInput).toHaveBeenCalledTimes(1);
    expect(set).not.toHaveBeenCalled();
  });
});

describe('max field', () => {
  it('only allows input greater than or equal to min', () => {
    let onInput = jest.fn();
    let onValidInput = jest.fn();
    let onInvalidInput = jest.fn();
    let set = jest.fn();
    act(() => {
      render(
        <DataRangeField
          initialValue={{ min: 0, max: 1 }}
          onInput={onInput}
          onValidInput={onValidInput}
          onInvalidInput={onInvalidInput}
          set={set}
        />,
        container,
      );
    });

    act(() => fireEvent.change(getMaxInput(), { target: { value: '0.25' } })); // greater than min
    expect(onInput).toHaveBeenCalledTimes(1);
    expect(onValidInput).toHaveBeenCalledTimes(1);
    expect(onInvalidInput).not.toHaveBeenCalled();
    act(() => fireEvent.blur(getMaxInput(), { bubbles: true }));
    expect(set.mock.calls[0][0]).toStrictEqual({ min: 0, max: 0.25 });

    act(() => fireEvent.change(getMaxInput(), { target: { value: '0' } })); // equal to min
    expect(onInput).toHaveBeenCalledTimes(2);
    expect(onValidInput).toHaveBeenCalledTimes(2);
    expect(onInvalidInput).not.toHaveBeenCalled();
    act(() => fireEvent.blur(getMaxInput(), { bubbles: true }));
    expect(set.mock.calls[1][0]).toStrictEqual({ min: 0, max: 0 });

    act(() => fireEvent.change(getMaxInput(), { target: { value: '-1' } })); // less than min
    expect(onInput).toHaveBeenCalledTimes(3);
    expect(onValidInput).toHaveBeenCalledTimes(2);
    expect(onInvalidInput).toHaveBeenCalledTimes(1);
    act(() => fireEvent.blur(getMaxInput(), { bubbles: true }));
    expect(set).toHaveBeenCalledTimes(2);
  });

  it('is reset to initial value when min field is focused and current value is invalid', () => {
    let onInput = jest.fn();
    let onValidInput = jest.fn();
    let set = jest.fn();
    act(() => {
      render(
        <DataRangeField
          initialValue={{ min: 0, max: 1 }}
          onInput={onInput}
          onValidInput={onValidInput}
          set={set}
        />,
        container,
      );
    });
    act(() => fireEvent.change(getMaxInput(), { target: { value: '-1' } })); // less than min
    expect(getMaxInput().value).toBe('-1');
    expect(onInput).toHaveBeenCalledTimes(1);
    expect(onValidInput).toHaveBeenCalledTimes(0);
    act(() => fireEvent.focus(getMinInput(), { bubbles: true }));
    expect(getMaxInput().value).toBe('1');
    expect(onInput).toHaveBeenCalledTimes(2);
    expect(onValidInput).toHaveBeenCalledTimes(1);
    expect(set).not.toHaveBeenCalled();
  });
});
