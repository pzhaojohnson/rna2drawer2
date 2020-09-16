import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';
import { MinField, MaxField, DataRangeField } from './DataRangeField';

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

describe('min field', () => {
  let onInput = jest.fn();
  let onValidInput = jest.fn();
  let onInvalidInput = jest.fn();
  let set = jest.fn();
  let ele = MinField({
    initialValue: { min: 55.91, max: 102 },
    onInput: onInput,
    onValidInput: onValidInput,
    onInvalidInput: onInvalidInput,
    set: set,
  });

  it('passes min of initial value', () => {
    expect(ele.props.initialValue).toBe(55.91);
  });

  it('passes on input callbacks', () => {
    expect(ele.props.onInput).toBe(onInput);
    expect(ele.props.onValidInput).toBe(onValidInput);
    expect(ele.props.onInvalidInput).toBe(onInvalidInput);
  });

  it('passes value between set callbacks', () => {
    ele.props.set(12.0333);
    expect(set.mock.calls[0][0]).toStrictEqual({ min: 12.0333, max: 102 });
  });
});

describe('max field', () => {
  let onInput = jest.fn();
  let onValidInput = jest.fn();
  let onInvalidInput = jest.fn();
  let set = jest.fn();
  let ele = MaxField({
    initialValue: { min: 55.91, max: 102.05 },
    onInput: onInput,
    onValidInput: onValidInput,
    onInvalidInput: onInvalidInput,
    set: set,
  });

  it('passes min of initial value', () => {
    expect(ele.props.initialValue).toBe(102.05);
  });

  it('passes on input callbacks', () => {
    expect(ele.props.onInput).toBe(onInput);
    expect(ele.props.onValidInput).toBe(onValidInput);
    expect(ele.props.onInvalidInput).toBe(onInvalidInput);
  });

  it('passes value between set callbacks', () => {
    ele.props.set(152.33);
    expect(set.mock.calls[0][0]).toStrictEqual({ min: 55.91, max: 152.33 });
  });
});

describe('data rangle field', () => {
  it('renders', () => {
    act(() => {
      render(
        <DataRangeField
          initialValue={{ min: 0, max: 1 }}
          onInput={jest.fn()}
          onValidInput={jest.fn()}
          onInvalidInput={jest.fn()}
          set={jest.fn()}
        />,
        container,
      );
    });
  });
});
