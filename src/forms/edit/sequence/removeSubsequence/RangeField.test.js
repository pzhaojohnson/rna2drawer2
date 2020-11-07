import App from '../../../../App';
import NodeSVG from '../../../../draw/NodeSVG';
import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { StartField, EndField, RangeField } from './RangeField';
import { act } from 'react-dom/test-utils';

let app = new App(() => NodeSVG());
app.strictDrawing.appendSequence('asdf', 'asdfasdf');

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

describe('start field', () => {
  let initialValue = { start: 57, end: 61 };
  let onInput = jest.fn();
  let onValidInput = jest.fn();
  let onInvalidInput = jest.fn();
  let set = jest.fn();
  let ele = StartField({
    initialValue: initialValue,
    onInput: onInput,
    onValidInput: onValidInput,
    onInvalidInput: onInvalidInput,
    set: set,
  });

  it('passes initial start value', () => {
    expect(ele.props.initialValue).toBe(57);
  });

  it('passes on input callbacks', () => {
    expect(ele.props.onInput).toBe(onInput);
    expect(ele.props.onValidInput).toBe(onValidInput);
    expect(ele.props.onInvalidInput).toBe(onInvalidInput);
  });

  it('passes value between set callbacks', () => {
    ele.props.set(38);
    expect(set.mock.calls[0][0]).toStrictEqual({ start: 38, end: 61 });
  });
});

describe('end field', () => {
  let initialValue = { start: 57, end: 61 };
  let onInput = jest.fn();
  let onValidInput = jest.fn();
  let onInvalidInput = jest.fn();
  let set = jest.fn();
  let ele = EndField({
    initialValue: initialValue,
    onInput: onInput,
    onValidInput: onValidInput,
    onInvalidInput: onInvalidInput,
    set: set,
  });

  it('passes initial start value', () => {
    expect(ele.props.initialValue).toBe(61);
  });

  it('passes on input callbacks', () => {
    expect(ele.props.onInput).toBe(onInput);
    expect(ele.props.onValidInput).toBe(onValidInput);
    expect(ele.props.onInvalidInput).toBe(onInvalidInput);
  });

  it('passes value between set callbacks', () => {
    ele.props.set(92);
    expect(set.mock.calls[0][0]).toStrictEqual({ start: 57, end: 92 });
  });
});

describe('range field', () => {
  it('renders', () => {
    act(() => {
      render(
        <RangeField
          initialValue={{ start: 1, end: 2 }}
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
