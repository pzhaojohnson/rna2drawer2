import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';
import { fireEvent } from '@testing-library/react';

import {
  CreateNewDrawing,
  _EXAMPLE_INPUTS,
} from './CreateNewDrawing';

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

function getTitleAndContent() {
  return getComponent().childNodes[0].childNodes[0].childNodes[0];
}

function getContent() {
  return getTitleAndContent().childNodes[1];
}

function getExampleInputSection() {
  return getContent().childNodes[0];
}

function getExampleInputSelect() {
  return getExampleInputSection().childNodes[1];
}

function getSequenceIdSection() {
  return getContent().childNodes[1];
}

function getSequenceIdInput() {
  return getSequenceIdSection().childNodes[1];
}

function getSequenceAndStructureSections() {
  return getContent().childNodes[2];
}

function getSequenceSection() {
  return getSequenceAndStructureSections().childNodes[0];
}

function getSequenceTextarea() {
  return getSequenceSection().childNodes[0].childNodes[1];
}

function getSequenceParsingDetailsToggle() {
  return getSequenceSection().childNodes[0].childNodes[0].childNodes[1];
}

function getSequenceParsingDetails() {
  return getSequenceSection().childNodes[1];
}

function getIgnoreNumbersCheckbox() {
  return getSequenceParsingDetails().childNodes[1].childNodes[1].childNodes[0];
}

function getIgnoreNonAUGCTLettersCheckbox() {
  return getSequenceParsingDetails().childNodes[1].childNodes[2].childNodes[0];
}

function getIgnoreNonAlphanumericsCheckbox() {
  return getSequenceParsingDetails().childNodes[1].childNodes[3].childNodes[0];
}

function getStructureSection() {
  return getSequenceAndStructureSections().childNodes[1];
}

function getStructureTextarea() {
  return getStructureSection().childNodes[0].childNodes[1];
}

function getStructureParsingDetailsToggle() {
  return getStructureSection().childNodes[0].childNodes[0].childNodes[1];
}

function getStructureParsingDetails() {
  return getStructureSection().childNodes[1];
}

function getErrorMessageSection() {
  return getContent().childNodes[3];
}

function getErrorMessageP() {
  return getErrorMessageSection().childNodes[0];
}

function getSubmitSection() {
  return getContent().childNodes[4];
}
function getSubmitButton() {
  return getSubmitSection().childNodes[0];
}

it('first example input is nothing', () => {
  let ei = _EXAMPLE_INPUTS[0];
  expect(ei.exampleInput).toBe('--- None ---');
  expect(ei.sequenceId).toBe('');
  expect(ei.sequence).toBe('');
  expect(ei.structure).toBe('');
});

it('default example input, sequence ID, sequence, and structure', () => {
  act(() => {
    render(<CreateNewDrawing />, container);
  });
  expect(getExampleInputSelect().value).toBe('--- None ---');
  expect(getSequenceIdInput().value).toBe('');
  expect(getSequenceTextarea().value).toBe('');
  expect(getStructureTextarea().value).toBe('');
});

it('selecting an example input shows it', () => {
  let ei = _EXAMPLE_INPUTS[1];
  act(() => {
    render(<CreateNewDrawing />, container);
    getExampleInputSelect().value = ei.exampleInput;
    getExampleInputSelect().dispatchEvent(
      new Event('change', { bubbles: true }),
    );
  });
  expect(getExampleInputSelect().value).toBe(ei.exampleInput);
  expect(getSequenceIdInput().value).toBe(ei.sequenceId);
  expect(getSequenceTextarea().value).toBe(ei.sequence);
  expect(getStructureTextarea().value).toBe(ei.structure);
});

it('selecting an example input overwrites existing input', () => {
  act(() => {
    render(<CreateNewDrawing />, container);
    fireEvent.change(
      getSequenceIdInput(),
      { target: { value: 'blah' } },
    );
    fireEvent.change(
      getSequenceTextarea(),
      { target: { value: ' aa dsdj' } },
    );
    fireEvent.change(
      getStructureTextarea(),
      { target: { value: '...((...))..' } },
    );
  });
  let ei = _EXAMPLE_INPUTS[1];
  act(() => {
    render(<CreateNewDrawing />, container);
    getExampleInputSelect().value = ei.exampleInput;
    getExampleInputSelect().dispatchEvent(
      new Event('change', { bubbles: true }),
    );
  });
  expect(getExampleInputSelect().value).toBe(ei.exampleInput);
  expect(getSequenceIdInput().value).toBe(ei.sequenceId);
  expect(getSequenceTextarea().value).toBe(ei.sequence);
  expect(getStructureTextarea().value).toBe(ei.structure);
});

it('all example inputs (besides the first) are valid', () => {
  _EXAMPLE_INPUTS.slice(1).forEach(ei => {
    let submit = jest.fn(() => {});
    act(() => {
      render(<CreateNewDrawing submit={submit} />, container);
      getExampleInputSelect().value = ei.exampleInput;
      getExampleInputSelect().dispatchEvent(
        new Event('change', { bubbles: true }),
      );
    });
    act(() => {
      getSubmitButton().dispatchEvent(
        new Event('click', { bubbles: true }),
      );
    });
    expect(submit.mock.calls.length).toBe(1);
    expect(getErrorMessageSection().childNodes.length).toBe(0);
  });
});

it('basic test of submitting a sequence ID', () => {});

it('empty sequence ID', () => {});

it('sequence ID is all whitespace', () => {});

it('basic test of submitting a sequence', () => {
  let submit = jest.fn(() => {});
  act(() => {
    render(<CreateNewDrawing submit={submit} />, container);
    fireEvent.change(
      getSequenceIdInput(),
      { target: { value: 'asdf' } },
    );
    fireEvent.change(
      getSequenceTextarea(),
      { target: { value: 'AGGCCUT' } },
    );
  });
  act(() => {
    getSubmitButton().dispatchEvent(
      new Event('click', { bubbles: true }),
    );
  });
  expect(submit.mock.calls.length).toBe(1);
  expect(submit.mock.calls[0][1]).toBe('AGGCCUT');
});

it('empty sequence', () => {});

it('sequence is all whitespace', () => {});

it('sequence is all ignored characters', () => {});

it('sequence parsing details are not shown by default', () => {
  act(() => {
    render(<CreateNewDrawing />, container);
  });
  expect(getSequenceParsingDetails().childNodes.length).toBe(0);
});

it('default sequence parsing options', () => {
  act(() => {
    render(<CreateNewDrawing />, container);
    getSequenceParsingDetailsToggle().dispatchEvent(
      new Event('click', { bubbles: true }),
    );
  });
  expect(getSequenceParsingDetails().childNodes.length).toBeGreaterThan(0);
  expect(getIgnoreNumbersCheckbox().checked).toBeTruthy();
  expect(getIgnoreNonAUGCTLettersCheckbox().checked).toBeTruthy();
  expect(getIgnoreNonAlphanumericsCheckbox().checked).toBeTruthy();
});

it('ignores numbers when checked', () => {});

it('includes numbers when unchecked', () => {});

it('ignores non-AUGCT letters when checked', () => {});

it('includes non-AUGCT letters when unchecked', () => {});

it('ignores non-alphanumerics when checked', () => {});

it('includes non-alphanumerics when unchecked', () => {});

it('ignores whitespace', () => {});

it('basic test of submitting a structure', () => {});

it('submitted structure includes tertiary pairs', () => {});

it('empty structure', () => {});

it('structure is all whitespace', () => {});

it('structure is all ignored characters', () => {});

it('sequence and structure are of length zero', () => {});

it('structure length does not match sequence length', () => {});

it('invalid structure', () => {});

it('structure parsing details are not shown by default', () => {
  act(() => {
    render(<CreateNewDrawing />, container);
  });
  expect(getStructureParsingDetails().childNodes.length).toBe(0);
});

it('no error message by default', () => {
  act(() => {
    render(<CreateNewDrawing />, container);
  });
  expect(getErrorMessageSection().childNodes.length).toBe(0);
});
