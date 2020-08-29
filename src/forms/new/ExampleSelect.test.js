import * as React from 'react';
import { render } from 'react-dom';
import { act } from 'react-dom/test-utils';
import { fireEvent } from '@testing-library/react';
import { ExampleSelect } from './ExampleSelect';

let container = document.createElement('div');
document.body.appendChild(container);

let examples = ['asdf', 'QWER', 'zxcvzxcv', 'asdfzxcvqwer'];
let selected = examples[1];
let select = jest.fn();
act(() => {
  render(
    <ExampleSelect
      examples={examples}
      selected={selected}
      select={select}
    />,
    container,
  )
});
let selectEle = container.getElementsByTagName('select')[0];

it('lists all examples', () => {
  examples.forEach(e => {
    expect(selectEle.textContent.includes(e)).toBeTruthy();
  });
});

it('value is set to selected', () => {
  expect(selectEle.value).toBe(selected);
});

it('onChange callback calls select callback', () => {
  act(() => fireEvent.change(selectEle, { target: { value: examples[0] } }));
  expect(select.mock.calls[0][0]).toBe(examples[0]);
  act(() => fireEvent.change(selectEle, { target: { value: examples[3] } }));
  expect(select.mock.calls[1][0]).toBe(examples[3]);
});
