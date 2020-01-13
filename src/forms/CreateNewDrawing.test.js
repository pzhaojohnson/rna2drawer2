import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';

import CreateNewDrawing from './CreateNewDrawing';

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

function getExampleInputSelect() {
  let outermostDiv = container.childNodes[0];
  let exampleInputDiv = outermostDiv.childNodes[2];
  return exampleInputDiv.childNodes[1]
}

function getSequenceIdInput() {
  let outermostDiv = container.childNodes[0];
  let sequenceIdDiv = outermostDiv.childNodes[3];
  return sequenceIdDiv.childNodes[1];
}

function getSequenceTextarea() {
  let outermostDiv = container.childNodes[0];
  return outermostDiv.childNodes[5];
}

function getStructureTextarea() {
  let outermostDiv = container.childNodes[0];
  return outermostDiv.childNodes[7];
}

function getSubmitButton() {
  let outermostDiv = container.childNodes[0];
  let submitOuterDiv = outermostDiv.childNodes[8];
  return submitOuterDiv.childNodes[1];
}

it('default example input', () => {
  act(() => {
    render(<CreateNewDrawing />, container);
  });

  expect(getExampleInputSelect().value).toBe('--- None ---');
  expect(getSequenceIdInput().value).toBe('');
  expect(getSequenceTextarea().value).toBe('');
  expect(getStructureTextarea().value).toBe('');
});

it('selecting example input', () => {
  let exampleInputSelect;

  act(() => {
    render(<CreateNewDrawing />, container);

    exampleInputSelect = getExampleInputSelect();
    exampleInputSelect.value = 'A Hairpin';
    exampleInputSelect.dispatchEvent(new Event('change', { bubbles: true }));
  });

  expect(exampleInputSelect.value).toBe('A Hairpin');
  expect(getSequenceIdInput().value).toBe('A Hairpin');
  expect(getSequenceTextarea().value).toBe('AUGCAUGGUAGCAU');
  expect(getStructureTextarea().value).toBe('((((......))))');
});

it('selecting example input with prior input', () => {

});
