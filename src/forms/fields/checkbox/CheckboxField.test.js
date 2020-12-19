import * as React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';
import { fireEvent } from '@testing-library/react';
import { CheckboxField } from './CheckboxField';

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

function showsCheck() {
  let check = container.getElementsByTagName('img')[0];
  return check && check.alt == 'Check';
}

function hasCheckedStyles() {
  return container.getElementsByClassName('checked').length == 1
    && container.getElementsByClassName('unchecked').length == 0;
}

function hasUncheckedStyles() {
  return container.getElementsByClassName('checked').length == 0
    && container.getElementsByClassName('unchecked').length == 1;
}

function isChecked() {
  return showsCheck() && hasCheckedStyles();
}

function isUnchecked() {
  return !showsCheck() && hasUncheckedStyles();
}

function expectToBeChecked() {
  expect(isChecked()).toBeTruthy();
}

function expectToBeUnchecked() {
  expect(isUnchecked()).toBeTruthy();
}

it('renders with specified name', () => {
  act(() => {
    render(<CheckboxField name='Field Name' />, container);
  });
  expect(container.textContent).toMatch(/Field Name/);
});

it('can be checked', () => {
  act(() => {
    render(<CheckboxField initialValue={true} />, container);
  });
  expectToBeChecked();
});

it('can be unchecked', () => {
  act(() => {
    render(<CheckboxField initialValue={false} />, container);
  });
  expectToBeUnchecked();
});

it('changes value and calls set callback when clicked', () => {
  let value = true;
  let set = jest.fn();
  act(() => {
    render(
      <CheckboxField name='asdf' initialValue={value} set={set} />,
      container,
    );
  });
  
  // any part of the field can be clicked
  let parts = container.childNodes[0].getElementsByTagName('*');

  // click multiple times
  expect(parts.length).toBeGreaterThan(1);

  for (let i = 0; i < parts.length; i++) {
    act(() => {
      fireEvent.click(parts[i], { bubbles: true });
    });
    value = !value;
    value ? expectToBeChecked() : expectToBeUnchecked();
    expect(set.mock.calls[i][0]).toBe(value);
  }
});
