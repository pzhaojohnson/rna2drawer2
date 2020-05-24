import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';

jest.mock('./Logo', () => () => <div>Logo</div>);

import Menu from './Menu';

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

function getMenu() {
  return container.childNodes[0];
}

it('renders with border and background colors', () => {
  act(() => {
    render(
      <Menu
        borderColor={'cyan'}
        backgroundColor={'blue'}
      />,
      container,
    );
  });
  let m = getMenu();
  expect(m.style.borderColor).toBe('cyan');
  expect(m.style.backgroundColor).toBe('blue');
});

it('renders logo and dropdowns', () => {
  act(() => {
    render(
      <Menu
        fileDropdown={<div>File Dropdown</div>}
        modeDropdown={<div>Mode Dropdown</div>}
        editDropdown={<div>Edit Dropdown</div>}
        exportDropdown={<div>Export Dropdown</div>}
      />,
      container,
    );
  });
  let m = getMenu();
  expect(m.childNodes[0].textContent).toBe('Logo');
  expect(m.childNodes[1].textContent).toBe('File Dropdown');
  expect(m.childNodes[2].textContent).toBe('Mode Dropdown');
  expect(m.childNodes[3].textContent).toBe('Edit Dropdown');
  expect(m.childNodes[4].textContent).toBe('Export Dropdown');
});
