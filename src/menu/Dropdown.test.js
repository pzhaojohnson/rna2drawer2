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

function getDroppedElements() {
  let d = getDropdown();
  return d.childNodes[1];
}

it('renders with border color', () => {
  act(() => {
    render(
      <Dropdown
        borderColor={'brown'}
        topButton={<div></div>}
        droppedElements={[]}
      />,
      container,
    );
  });
  let des = getDroppedElements();
  expect(des.style.borderColor).toBe('brown');
});

it('renders top button', () => {
  act(() => {
    render(
      <Dropdown
        topButton={<div>Top Button</div>}
        droppedElements={[]}
      />,
      container,
    );
  });
  let tb = getTopButton();
  expect(tb.textContent).toBe('Top Button');
});

it('renders dropped elements', () => {
  act(() => {
    render(
      <Dropdown
        topButton={<div></div>}
        droppedElements={[
          <div key={'1'} >Dropped Button 1</div>,
          <div key={'2'} >Separator</div>,
          <div key={'3'} >Dropped Button 2</div>,
        ]}
      />,
      container,
    );
  });
  let des = getDroppedElements();
  expect(des.childNodes[0].textContent).toBe('Dropped Button 1');
  expect(des.childNodes[1].textContent).toBe('Separator');
  expect(des.childNodes[2].textContent).toBe('Dropped Button 2');
});
