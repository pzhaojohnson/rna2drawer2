import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';
import { fireEvent } from '@testing-library/react';
import { OpenCT } from './OpenCT';

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

function getTitleAndContent() {
  return container.childNodes[0].childNodes[0].childNodes[0].childNodes[0];
}

function getContent() {
  return getTitleAndContent().childNodes[1];
}

function getSequenceIdInput() {
  return getContent().childNodes[0].childNodes[1];
}

function getFileInput() {
  return getContent().childNodes[1].childNodes[0];
}

function getErrorMessageSection() {
  return getContent().childNodes[2];
}

function getErrorMessageP() {
  return getErrorMessageSection().childNodes[0];
}

function getSubmitButton() {
  return getContent().childNodes[3].childNodes[0];
}

it('renders', () => {
  act(() => {
    render(<OpenCT />, container);
  });
});

it('basic test of submitting sequence ID', () => {});

it('empty sequence ID', () => {});

it('sequence ID is all whitespace', () => {});

it('leading and trailing whitespace is trimmed from sequence ID', () => {});

it('file input change - no files uploaded', () => {
  let submit = jest.fn();
  act(() => {
    render(<OpenCT />, container);
    fireEvent.change(
      getSequenceIdInput(),
      { target: { value: 'asdf' } },
    );
    fireEvent.change(
      getFileInput(),
      { target: { files: [] } },
    );
  });
  expect(getErrorMessageSection().childNodes.length).toBe(0);
  act(() => {
    getSubmitButton().dispatchEvent(
      new Event('click', { bubbles: true }),
    );
  });
  expect(submit.mock.calls.length).toBe(0);
  expect(getErrorMessageP().textContent).toBe('No file uploaded.');
});

/*
it('file input change - error loading file', () => {
  let submit = jest.fn();
  act(() => {
    render(<OpenCT submit={submit} />, container);
    fireEvent.change(
      getSequenceIdInput(),
      { target: { value: 'asdf' } },
    );
    getFileInput().files = [new Blob(['asdf'], { type: 'text/plain' })];
    fireEvent.change(
      getFileInput(),
    );
  });
  expect(getErrorMessageSection().childNodes.length).toBe(0);
  act(() => {
    getSubmitButton().dispatchEvent(
      new Event('click', { bubbles: true }),
    );
  });
  expect(submit.mock.calls.length).toBe(0);
  expect(getErrorMessageP().textContent).toBe('Unable to read selected file.');
});
*/

it('file input change - file loads successfully', () => {});

it('submit - no file uploaded', () => {});

it('submit - error loading file', () => {});

it('submit - no structures in CT file', () => {});

it('submit - multiple structures in CT file', () => {});

it('submit - structure of length zero', () => {});

it('submitting a CT file downloaded from Mfold', () => {});
