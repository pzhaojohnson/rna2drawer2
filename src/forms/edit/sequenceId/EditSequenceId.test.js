import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';
import { fireEvent } from '@testing-library/react';
import EditSequenceId from './EditSequenceId';

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

function getComponent() {
  return container.childNodes[0];
}

function getCloseButton() {
  return getComponent().childNodes[0];
}

function getTitleAndContent() {
  return getComponent().childNodes[1];
}

function getIdField() {
  return getTitleAndContent().childNodes[1];
}

function getIdInput() {
  return getIdField().childNodes[1];
}

function getErrorMessageSection() {
  return getTitleAndContent().childNodes[2];
}

function getApplySection() {
  return getTitleAndContent().childNodes[3];
}

function getApplyButton() {
  return getApplySection().childNodes[0];
}

describe('close button', () => {
  it('binds close button', () => {
    let close = jest.fn();
    act(() => {
      render(<EditSequenceId close={close} />, container);
    });
    let cb = getCloseButton();
    expect(close).not.toHaveBeenCalled();
    act(() => {
      cb.dispatchEvent(new Event('click', { bubbles: true }));
    });
    expect(close).toHaveBeenCalled();
  });

  it('handles missing close callback', () => {
    act(() => {
      render(<EditSequenceId />, container);
      let cb = getCloseButton();
      cb.dispatchEvent(new Event('click', { bubbles: true }));
    });
  });
});

it('shows current ID in ID field', () => {
  act(() => {
    render(<EditSequenceId currId='A unique ID' />, container);
  });
  let idInput = getIdInput();
  expect(idInput.value).toBe('A unique ID');
});

describe('applying entered sequence ID', () => {
  it('passes entered sequence ID to callback', () => {
    let apply = jest.fn();
    act(() => {
      render(<EditSequenceId apply={apply} />, container);
      let idInput = getIdInput();
      fireEvent.change(idInput, { target: { value: 'Another unique ID' } });
    });
    act(() => {
      let ab = getApplyButton();
      ab.dispatchEvent(new Event('click', { bubbles: true }));
    });
    expect(apply.mock.calls[0][0]).toBe('Another unique ID');
  });

  it('trims leading and trailing whitespace', () => {
    let apply = jest.fn();
    act(() => {
      render(<EditSequenceId apply={apply} />, container);
      let idInput = getIdInput();
      fireEvent.change(idInput, { target: { value: '   needed trimming    ' } });
    });
    act(() => {
      let ab = getApplyButton();
      ab.dispatchEvent(new Event('click', { bubbles: true }));
    });
    expect(apply.mock.calls[0][0]).toBe('needed trimming');
  });
});

it('handles missing apply callback', () => {
  act(() => {
    render(<EditSequenceId />, container);
    // enter nonempty sequence ID so that apply callback should be called
    let idInput = getIdInput();
    fireEvent.change(idInput, { target: { value: 'A Sequence ID' } });
  });
  act(() => {
    let ab = getApplyButton();
    ab.dispatchEvent(new Event('click', { bubbles: true }));
  });
});

describe('empty sequence ID', () => {
  it('handles empty string', () => {
    let apply = jest.fn();
    act(() => {
      render(<EditSequenceId />, container);
      let idInput = getIdInput();
      fireEvent.change(idInput, { target: { value: '' } });
    });
    expect(getErrorMessageSection().textContent).toBeFalsy();
    act(() => {
      let ab = getApplyButton();
      ab.dispatchEvent(new Event('click', { bubbles: true }));
    });
    expect(apply).not.toHaveBeenCalled();
    expect(getErrorMessageSection().textContent).toBeTruthy();
  });

  it('handles all whitespace', () => {
    let apply = jest.fn();
    act(() => {
      render(<EditSequenceId />, container);
      let idInput = getIdInput();
      fireEvent.change(idInput, { target: { value: '     ' } });
    });
    expect(getErrorMessageSection().textContent).toBeFalsy();
    act(() => {
      let ab = getApplyButton();
      ab.dispatchEvent(new Event('click', { bubbles: true }));
    });
    expect(apply).not.toHaveBeenCalled();
    expect(getErrorMessageSection().textContent).toBeTruthy();
  });
});

it('entering a valid sequence ID after entering an invalid one', () => {
  let apply = jest.fn();
  act(() => {
    render(<EditSequenceId apply={apply} />, container);
    let idInput = getIdInput();
    fireEvent.change(idInput, { target: { value: '' } }); // an empty sequence ID
  });
  act(() => {
    let ab = getApplyButton();
    ab.dispatchEvent(new Event('click', { bubbles: true }));
  });
  expect(apply).not.toHaveBeenCalled();
  expect(getErrorMessageSection().textContent).toBeTruthy();
  act(() => {
    let idInput = getIdInput();
    fireEvent.change(idInput, { target: { value: 'A valid ID' } });
  });
  act(() => {
    let ab = getApplyButton();
    ab.dispatchEvent(new Event('click', { bubbles: true }));
  });
  expect(apply.mock.calls[0][0]).toBe('A valid ID');
  expect(getErrorMessageSection().textContent).toBeFalsy(); // clears any error message
});
