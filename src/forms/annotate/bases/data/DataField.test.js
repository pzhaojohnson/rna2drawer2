import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';
import { fireEvent } from '@testing-library/react';
import { DataField } from './DataField';
import { parseData } from './parseData';

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

function getTextarea() {
  return container.childNodes[0].childNodes[1];
}

it('renders with initial value', () => {
  let data = [4, 40.2, -5, -2];
  act(() => render(<DataField initialValue={data} />, container));
  expect(getTextarea().value).toBe('4\n40.2\n-5\n-2');
});

it('shows error message for unparsable data', () => {
  act(() => render(<DataField initialValue={[]} />, container));
  let rawData = '1, 2a , 5';
  expect(parseData(rawData)).toBeFalsy(); // cannot be parsed
  act(() => fireEvent.change(getTextarea(), { target: { value: rawData } }));
  expect(container.textContent.includes('Unable to parse data.')).toBeTruthy();
});

it('passes on input callbacks', () => {
  let onInput = jest.fn();
  let onValidInput = jest.fn();
  let onInvalidInput = jest.fn();
  act(() => render(
    <DataField
      initialValue={[]}
      onInput={onInput}
      onValidInput={onValidInput}
      onInvalidInput={onInvalidInput}
    />,
    container,
  ));
  let rawData = '1 2';
  expect(parseData(rawData)).toBeTruthy(); // can be parsed
  act(() => fireEvent.change(getTextarea(), { target: { value: rawData } }));
  expect(onInput).toHaveBeenCalledTimes(1);
  expect(onValidInput).toHaveBeenCalledTimes(1);
  expect(onInvalidInput).not.toHaveBeenCalled();
  rawData = '1a 5 2';
  expect(parseData(rawData)).toBeFalsy(); // cannot be parsed
  act(() => fireEvent.change(getTextarea(), { target: { value: rawData } }));
  expect(onInput).toHaveBeenCalledTimes(2);
  expect(onValidInput).toHaveBeenCalledTimes(1);
  expect(onInvalidInput).toHaveBeenCalledTimes(1);
});

it('sets when data can be parsed', () => {
  let set = jest.fn();
  act(() => render(<DataField initialValue={[]} set={set} />, container));
  let rawData = '1 2 , 4,5\t 10';
  expect(parseData(rawData)).toBeTruthy(); // can be parsed
  act(() => fireEvent.change(getTextarea(), { target: { value: rawData } }));
  act(() => fireEvent.blur(getTextarea(), { bubbles: true } ));
  expect(set.mock.calls[0][0]).toStrictEqual(parseData(rawData));
});

it('does not set when data cannot be parsed', () => {
  let set = jest.fn();
  act(() => render(<DataField initialValue={[]} set={set} />, container));
  let rawData = '1 2 , z4,5\t 10';
  expect(parseData(rawData)).toBeFalsy(); // cannot be parsed
  act(() => fireEvent.change(getTextarea(), { target: { value: rawData } }));
  act(() => fireEvent.blur(getTextarea(), { bubbles: true } ));
  expect(set).not.toHaveBeenCalled();
});
