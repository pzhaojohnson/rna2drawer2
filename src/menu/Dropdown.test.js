import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';
import Dropdown from './Dropdown';

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

function getDropdown() {
  return container.childNodes[0];
}

function getTopButton() {
  let d = getDropdown();
  return d.childNodes[0];
}

function getDropped() {
  let d = getDropdown();
  return d.childNodes[1];
}

it('renders with border color', () => {
  act(() => {
    render(
      <Dropdown
        borderColor={'brown'}
        name={'asdf'}
        dropped={<div></div>}
      />,
      container,
    );
  });
  let dropped = getDropped();
  expect(dropped.style.borderColor).toBe('brown');
});

it('renders name', () => {
  act(() => {
    render(<Dropdown name={'Dropdown Name'} dropped={<div></div>} />, container);
  });
  expect(container.textContent.includes('Dropdown Name')).toBeTruthy();
});

it('renders dropped element', () => {
  act(() => {
    render(<Dropdown name={'asdf'} dropped={<div>Asdf Qwer</div>} />, container);
  });
  expect(container.textContent.includes('Asdf Qwer')).toBeTruthy();
});

describe('when disabled', () => {
  it('disables top button', () => {
    let dd = new Dropdown({ name: 'asdf', dropped: <div></div>, disabled: true });
    let ele = dd.render();
    expect(ele.props.children[0].props.disabled).toBeTruthy();
  });

  it('does not render dropped element', () => {
    act(() => {
      render(
        <Dropdown name={'asdf'} dropped={<div>Asdf Qwer</div>} disabled={true} />,
        container,
      );
    });
    expect(container.textContent.includes('Asdf Qwer')).toBeFalsy();
  });
});
