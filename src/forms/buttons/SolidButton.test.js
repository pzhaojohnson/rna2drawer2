import * as React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';
import { fireEvent } from '@testing-library/react';
import { SolidButton } from './SolidButton';

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

it('has enabled CSS styles when enabled', () => {
  let b = SolidButton({});
  expect(b.props.className).toMatch(/enabled/);
  expect(b.props.className).not.toMatch(/disabled/);
});

it('renders with provided children', () => {
  act(() => {
    render(
      <SolidButton>
        <span>12345</span>
        abCde
      </SolidButton>,
      container,
    );
  });
  expect(container.textContent).toBe('12345abCde');
});

it('binds onClick callback', () => {
  let onClick = jest.fn();
  act(() => render(<SolidButton onClick={onClick} />, container));
  expect(onClick).not.toHaveBeenCalled();
  act(() => {
    fireEvent(
      container.childNodes[0],
      new MouseEvent('click', { bubbles: true })
    );
  });
  expect(onClick).toHaveBeenCalled();
});

it('renders with specified CSS styles', () => {
  act(() => {
    render(<SolidButton style={{ margin: '0px 0px 12.87px 1px' }} />, container);
  });
  expect(container.firstChild.style.margin).toBe('0px 0px 12.87px 1px');
});

describe('when disabled', () => {
  it('has disabled CSS styles', () => {
    let b = SolidButton({ disabled: true });
    expect(b.props.className).toMatch(/disabled/);
    expect(b.props.className).not.toMatch(/enabled/);
  });

  it('does not bind onClick callback', () => {
    let onClick = jest.fn();
    act(() => render(<SolidButton onClick={onClick} disabled={true} />, container));
    act(() => {
      fireEvent(
        container.childNodes[0],
        new MouseEvent('click', { bubbles: true })
      );
    });
    expect(onClick).not.toHaveBeenCalled();
  });
});
