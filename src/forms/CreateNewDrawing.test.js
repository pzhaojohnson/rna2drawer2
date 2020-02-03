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
  let exampleInputSection = container.childNodes[0].childNodes[1];
  return exampleInputSection.childNodes[1];
}

function getSequenceIdInput() {
  let sequenceIdSection = container.childNodes[0].childNodes[2];
  return sequenceIdSection.childNodes[1];
}

function getSequenceTextarea() {
  let sequenceAndStructureSection = container.childNodes[0].childNodes[3];
  let sequenceSection = sequenceAndStructureSection.childNodes[0];
  return sequenceSection.childNodes[0].childNodes[1];
}

function getStructureTextarea() {
  let sequenceAndStructureSection = container.childNodes[0].childNodes[3];
  let structureSection = sequenceAndStructureSection.childNodes[1];
  return structureSection.childNodes[0].childNodes[1];
}

function getSubmitButton() {
  return container.childNodes[0].childNodes[5].childNodes[0].childNodes[0];
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
  let exampleInputSelect;
  let sequenceIdInput;
  let sequenceTextarea;
  let structureTextarea;

  act(() => {
    render(<CreateNewDrawing />, container);

    sequenceIdInput = getSequenceIdInput();
    sequenceIdInput.value = 'a sequence id';
    sequenceIdInput.dispatchEvent(new Event('change', { bubbles: true }));

    sequenceTextarea = getSequenceTextarea();
    sequenceTextarea.value = 'AAAGGGGGGUUUCC';
    sequenceTextarea.dispatchEvent(new Event('change', { bubbles: true }));

    structureTextarea = getStructureTextarea();
    structureTextarea.value = '(((......)))..';
    structureTextarea.dispatchEvent(new Event('change', { bubbles: true }));

    exampleInputSelect = getExampleInputSelect();
    exampleInputSelect.value = 'A Hairpin';
    exampleInputSelect.dispatchEvent(new Event('change', { bubbles: true }));
  });

  expect(exampleInputSelect.value).toBe('A Hairpin');
  expect(getSequenceIdInput().value).toBe('A Hairpin');
  expect(getSequenceTextarea().value).toBe('AUGCAUGGUAGCAU');
  expect(getStructureTextarea().value).toBe('((((......))))');
});
