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
    let submit = jest.fn();
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

it('basic test of submitting a sequence ID', () => {
  let submit = jest.fn();
  act(() => {
    render(<CreateNewDrawing submit={submit} />, container);
    fireEvent.change(
      getSequenceIdInput(),
      { target: { value: 'a sequence ID' } },
    );
    fireEvent.change(
      getSequenceTextarea(),
      { target: { value: 'aaa' } },
    );
  });
  act(() => {
    getSubmitButton().dispatchEvent(
      new Event('click', { bubbles: true }),
    );
  });
  expect(submit.mock.calls.length).toBe(1);
  expect(submit.mock.calls[0][0]).toBe('a sequence ID');
});

it('empty sequence ID', () => {
  let submit = jest.fn();
  act(() => {
    render(<CreateNewDrawing submit={submit} />, container);
    fireEvent.change(
      getSequenceIdInput(),
      { target: { value: '' } },
    );
    fireEvent.change(
      getSequenceTextarea(),
      { target: { value: 'aaa' } },
    );
  });
  act(() => {
    getSubmitButton().dispatchEvent(
      new Event('click', { bubbles: true }),
    );
  });
  expect(submit.mock.calls.length).toBe(0);
  expect(getErrorMessageP().textContent).toBe('Sequence ID is empty.');
});

it('sequence ID is all whitespace', () => {
  let submit = jest.fn();
  act(() => {
    render(<CreateNewDrawing submit={submit} />, container);
    fireEvent.change(
      getSequenceIdInput(),
      { target: { value: ' \t\t\t   \t ' } },
    );
    fireEvent.change(
      getSequenceTextarea(),
      { target: { value: 'aaa' } },
    );
  });
  act(() => {
    getSubmitButton().dispatchEvent(
      new Event('click', { bubbles: true }),
    );
  });
  expect(submit.mock.calls.length).toBe(0);
  expect(getErrorMessageP().textContent).toBe('Sequence ID is empty.');
});

it('trims leading and trailing whitespace from sequence ID', () => {
  let submit = jest.fn();
  act(() => {
    render(<CreateNewDrawing submit={submit} />, container);
    fireEvent.change(
      getSequenceIdInput(),
      { target: { value: ' \tas  dd gh\t' } },
    );
    fireEvent.change(
      getSequenceTextarea(),
      { target: { value: 'aaa' } },
    );
  });
  act(() => {
    getSubmitButton().dispatchEvent(
      new Event('click', { bubbles: true }),
    );
  });
  expect(submit.mock.calls.length).toBe(1);
  expect(submit.mock.calls[0][0]).toBe('as  dd gh');
});

it('basic test of submitting a sequence', () => {
  let submit = jest.fn();
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

it('empty sequence', () => {
  let submit = jest.fn();
  act(() => {
    render(<CreateNewDrawing submit={submit} />, container);
    fireEvent.change(
      getSequenceIdInput(),
      { target: { value: 'asdf' } },
    );
    fireEvent.change(
      getSequenceTextarea(),
      { target: { value: '' } },
    );
  });
  act(() => {
    getSubmitButton().dispatchEvent(
      new Event('click', { bubbles: true }),
    );
  });
  expect(submit.mock.calls.length).toBe(0);
  expect(getErrorMessageP().textContent).toBe('Sequence is empty.');
});

it('sequence is all whitespace', () => {
  let submit = jest.fn();
  act(() => {
    render(<CreateNewDrawing submit={submit} />, container);
    fireEvent.change(
      getSequenceIdInput(),
      { target: { value: 'asdf' } },
    );
    fireEvent.change(
      getSequenceTextarea(),
      { target: { value: '\t\t \n\n  \t ' } },
    );
  });
  act(() => {
    getSubmitButton().dispatchEvent(
      new Event('click', { bubbles: true }),
    );
  });
  expect(submit.mock.calls.length).toBe(0);
  expect(getErrorMessageP().textContent).toBe('Sequence is empty.');
});

it('sequence is all ignored characters', () => {
  let submit = jest.fn();
  act(() => {
    render(<CreateNewDrawing submit={submit} />, container);
    fireEvent.change(
      getSequenceIdInput(),
      { target: { value: 'asdf' } },
    );
    fireEvent.change(
      getSequenceTextarea(),
      { target: { value: ' 1dd >\n<.. () 345 ' } },
    );
  });
  act(() => {
    getSubmitButton().dispatchEvent(
      new Event('click', { bubbles: true }),
    );
  });
  expect(submit.mock.calls.length).toBe(0);
  expect(getErrorMessageP().textContent).toBe('Sequence is empty.');
});

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

it('ignores numbers when checked', () => {
  let submit = jest.fn();
  act(() => {
    render(<CreateNewDrawing submit={submit} />, container);
    fireEvent.change(
      getSequenceIdInput(),
      { target: { value: 'asdf' } },
    );
    fireEvent.change(
      getSequenceTextarea(),
      { target: { value: 'aa123gg' } },
    );
  });
  act(() => {
    getSubmitButton().dispatchEvent(
      new Event('click', { bubbles: true }),
    );
  });
  expect(submit.mock.calls.length).toBe(1);
  expect(submit.mock.calls[0][1]).toBe('aagg');
});

it('includes numbers when unchecked', () => {
  let submit = jest.fn();
  act(() => {
    render(<CreateNewDrawing submit={submit} />, container);
    fireEvent.change(
      getSequenceIdInput(),
      { target: { value: 'asdf' } },
    );
    fireEvent.change(
      getSequenceTextarea(),
      { target: { value: 'aa123gg' } },
    );
    getSequenceParsingDetailsToggle().dispatchEvent(
      new Event('click', { bubbles: true }),
    );
  });
  act(() => {
    getIgnoreNumbersCheckbox().dispatchEvent(
      new Event('click', { bubbles: true }),
    );
  });
  act(() => {
    getSubmitButton().dispatchEvent(
      new Event('click', { bubbles: true }),
    );
  });
  expect(submit.mock.calls.length).toBe(1);
  expect(submit.mock.calls[0][1]).toBe('aa123gg');
});

it('ignores non-AUGCT letters when checked', () => {
  let submit = jest.fn();
  act(() => {
    render(<CreateNewDrawing submit={submit} />, container);
    fireEvent.change(
      getSequenceIdInput(),
      { target: { value: 'asdf' } },
    );
    fireEvent.change(
      getSequenceTextarea(),
      { target: { value: 'aAhjmUtlpw CC' } },
    );
  });
  act(() => {
    getSubmitButton().dispatchEvent(
      new Event('click', { bubbles: true }),
    );
  });
  expect(submit.mock.calls.length).toBe(1);
  expect(submit.mock.calls[0][1]).toBe('aAUtCC');
});

it('includes non-AUGCT letters when unchecked', () => {
  let submit = jest.fn();
  act(() => {
    render(<CreateNewDrawing submit={submit} />, container);
    fireEvent.change(
      getSequenceIdInput(),
      { target: { value: 'asdf' } },
    );
    fireEvent.change(
      getSequenceTextarea(),
      { target: { value: 'aAhjmUtlpw CC' } },
    );
    getSequenceParsingDetailsToggle().dispatchEvent(
      new Event('click', { bubbles: true }),
    );
  });
  act(() => {
    getIgnoreNonAUGCTLettersCheckbox().dispatchEvent(
      new Event('click', { bubbles: true }),
    );
  });
  act(() => {
    getSubmitButton().dispatchEvent(
      new Event('click', { bubbles: true }),
    );
  });
  expect(submit.mock.calls.length).toBe(1);
  expect(submit.mock.calls[0][1]).toBe('aAhjmUtlpwCC');
});

it('ignores non-alphanumerics when checked', () => {
  let submit = jest.fn();
  act(() => {
    render(<CreateNewDrawing submit={submit} />, container);
    fireEvent.change(
      getSequenceIdInput(),
      { target: { value: 'asdf' } },
    );
    fireEvent.change(
      getSequenceTextarea(),
      { target: { value: '..Ggca<>()Ct] ' } },
    );
  });
  act(() => {
    getSubmitButton().dispatchEvent(
      new Event('click', { bubbles: true }),
    );
  });
  expect(submit.mock.calls.length).toBe(1);
  expect(submit.mock.calls[0][1]).toBe('GgcaCt');
});

it('includes non-alphanumerics when unchecked', () => {
  let submit = jest.fn();
  act(() => {
    render(<CreateNewDrawing submit={submit} />, container);
    fireEvent.change(
      getSequenceIdInput(),
      { target: { value: 'asdf' } },
    );
    fireEvent.change(
      getSequenceTextarea(),
      { target: { value: '..Ggca<>()Ct] ' } },
    );
    getSequenceParsingDetailsToggle().dispatchEvent(
      new Event('click', { bubbles: true }),
    );
  });
  act(() => {
    getIgnoreNonAlphanumericsCheckbox().dispatchEvent(
      new Event('click', { bubbles: true }),
    );
  });
  act(() => {
    getSubmitButton().dispatchEvent(
      new Event('click', { bubbles: true }),
    );
  });
  expect(submit.mock.calls.length).toBe(1);
  expect(submit.mock.calls[0][1]).toBe('..Ggca<>()Ct]');
});

it('ignores whitespace', () => {
  let submit = jest.fn();
  act(() => {
    render(<CreateNewDrawing submit={submit} />, container);
    fireEvent.change(
      getSequenceIdInput(),
      { target: { value: 'asdf' } },
    );
    fireEvent.change(
      getSequenceTextarea(),
      { target: { value: '\taA\n\n\r\n  qqwret \n ct TT\n' } },
    );
  });
  act(() => {
    getSubmitButton().dispatchEvent(
      new Event('click', { bubbles: true }),
    );
  });
  expect(submit.mock.calls.length).toBe(1);
  expect(submit.mock.calls[0][1]).toBe('aAtctTT');
});

function unpairedPartners(length) {
  let partners = [];
  for (let i = 0; i < length; i++) {
    partners.push(null);
  }
  return partners;
}

function checkPartners(partners, expectedPartners) {
  expect(partners.length).toBe(expectedPartners.length);
  for (let i = 0; i < expectedPartners.length; i++) {
    expect(partners[i]).toBe(expectedPartners[i]);
  }
}

it('basic test of submitting a structure', () => {
  let submit = jest.fn();
  act(() => {
    render(<CreateNewDrawing submit={submit} />, container);
    fireEvent.change(
      getSequenceIdInput(),
      { target: { value: 'asdf' } },
    );
    fireEvent.change(
      getSequenceTextarea(),
      { target: { value: 'aaaaaa' } },
    );
    fireEvent.change(
      getStructureTextarea(),
      { target: { value: '((..))' } },
    );
  });
  act(() => {
    getSubmitButton().dispatchEvent(
      new Event('click', { bubbles: true }),
    );
  });
  expect(submit.mock.calls.length).toBe(1);
  checkPartners(
    submit.mock.calls[0][2],
    [6, 5, null, null, 2, 1],
  );
  checkPartners(
    submit.mock.calls[0][3],
    unpairedPartners(6),
  );
});

it('submitted structure includes tertiary pairs', () => {
  let submit = jest.fn();
  act(() => {
    render(<CreateNewDrawing submit={submit} />, container);
    fireEvent.change(
      getSequenceIdInput(),
      { target: { value: 'asdf' } },
    );
    fireEvent.change(
      getSequenceTextarea(),
      { target: { value: 'aaaaaaaa' } },
    );
    fireEvent.change(
      getStructureTextarea(),
      { target: { value: '(([[))]]' } },
    );
  });
  act(() => {
    getSubmitButton().dispatchEvent(
      new Event('click', { bubbles: true }),
    );
  });
  expect(submit.mock.calls.length).toBe(1);
  checkPartners(
    submit.mock.calls[0][2],
    [6, 5, null, null, 2, 1, null, null],
  );
  checkPartners(
    submit.mock.calls[0][3],
    [null, null, 8, 7, null, null, 4, 3],
  );
});

it('empty structure', () => {
  let submit = jest.fn();
  act(() => {
    render(<CreateNewDrawing submit={submit} />, container);
    fireEvent.change(
      getSequenceIdInput(),
      { target: { value: 'asdf' } },
    );
    fireEvent.change(
      getSequenceTextarea(),
      { target: { value: 'aaaaaa' } },
    );
    fireEvent.change(
      getStructureTextarea(),
      { target: { value: '' } },
    );
  });
  act(() => {
    getSubmitButton().dispatchEvent(
      new Event('click', { bubbles: true }),
    );
  });
  expect(submit.mock.calls.length).toBe(1);
  checkPartners(
    submit.mock.calls[0][2],
    unpairedPartners(6),
  );
  checkPartners(
    submit.mock.calls[0][3],
    unpairedPartners(6),
  );
});

it('structure is all whitespace', () => {
  let submit = jest.fn();
  act(() => {
    render(<CreateNewDrawing submit={submit} />, container);
    fireEvent.change(
      getSequenceIdInput(),
      { target: { value: 'asdf' } },
    );
    fireEvent.change(
      getSequenceTextarea(),
      { target: { value: 'aaaaaa' } },
    );
    fireEvent.change(
      getStructureTextarea(),
      { target: { value: '  \t\t\n\r\n  \t  ' } },
    );
  });
  act(() => {
    getSubmitButton().dispatchEvent(
      new Event('click', { bubbles: true }),
    );
  });
  expect(submit.mock.calls.length).toBe(1);
  checkPartners(
    submit.mock.calls[0][2],
    unpairedPartners(6),
  );
  checkPartners(
    submit.mock.calls[0][3],
    unpairedPartners(6),
  );
});

it('structure is all ignored characters', () => {
  let submit = jest.fn();
  act(() => {
    render(<CreateNewDrawing submit={submit} />, container);
    fireEvent.change(
      getSequenceIdInput(),
      { target: { value: 'asdf' } },
    );
    fireEvent.change(
      getSequenceTextarea(),
      { target: { value: 'aaaaaa' } },
    );
    fireEvent.change(
      getStructureTextarea(),
      { target: { value: ' a  weur \t\t wiej asd' } },
    );
  });
  act(() => {
    getSubmitButton().dispatchEvent(
      new Event('click', { bubbles: true }),
    );
  });
  expect(submit.mock.calls.length).toBe(1);
  checkPartners(
    submit.mock.calls[0][2],
    unpairedPartners(6),
  );
  checkPartners(
    submit.mock.calls[0][3],
    unpairedPartners(6),
  );
});

it('sequence and structure are of length zero', () => {
  let submit = jest.fn();
  act(() => {
    render(<CreateNewDrawing submit={submit} />, container);
    fireEvent.change(
      getSequenceIdInput(),
      { target: { value: 'asdf' } },
    );
    fireEvent.change(
      getSequenceTextarea(),
      { target: { value: '' } },
    );
    fireEvent.change(
      getStructureTextarea(),
      { target: { value: '' } },
    );
  });
  act(() => {
    getSubmitButton().dispatchEvent(
      new Event('click', { bubbles: true }),
    );
  });
  expect(submit.mock.calls.length).toBe(0);
  expect(getErrorMessageP().textContent).toBe('Sequence is empty.');
});

it('structure length does not match sequence length', () => {
  let submit = jest.fn();
  act(() => {
    render(<CreateNewDrawing submit={submit} />, container);
    fireEvent.change(
      getSequenceIdInput(),
      { target: { value: 'asdf' } },
    );
    fireEvent.change(
      getSequenceTextarea(),
      { target: { value: 'aaaaaa' } },
    );
    fireEvent.change(
      getStructureTextarea(),
      { target: { value: '....' } },
    );
  });
  act(() => {
    getSubmitButton().dispatchEvent(
      new Event('click', { bubbles: true }),
    );
  });
  expect(submit.mock.calls.length).toBe(0);
  expect(getErrorMessageP().textContent).toBe('Sequence and structure are different lengths.');
});

it('unmatched upstream partner', () => {
  let submit = jest.fn();
  act(() => {
    render(<CreateNewDrawing submit={submit} />, container);
    fireEvent.change(
      getSequenceIdInput(),
      { target: { value: 'asdf' } },
    );
    fireEvent.change(
      getSequenceTextarea(),
      { target: { value: 'aaaaaa' } },
    );
    fireEvent.change(
      getStructureTextarea(),
      { target: { value: '((...)' } },
    );
  });
  act(() => {
    getSubmitButton().dispatchEvent(
      new Event('click', { bubbles: true }),
    );
  });
  expect(submit.mock.calls.length).toBe(0);
  expect(getErrorMessageP().textContent).toBe('Unmatched "(" in structure.');
});

it('unmatched downstream partner', () => {
  let submit = jest.fn();
  act(() => {
    render(<CreateNewDrawing submit={submit} />, container);
    fireEvent.change(
      getSequenceIdInput(),
      { target: { value: 'asdf' } },
    );
    fireEvent.change(
      getSequenceTextarea(),
      { target: { value: 'aaaaaa' } },
    );
    fireEvent.change(
      getStructureTextarea(),
      { target: { value: '(...)]' } },
    );
  });
  act(() => {
    getSubmitButton().dispatchEvent(
      new Event('click', { bubbles: true }),
    );
  });
  expect(submit.mock.calls.length).toBe(0);
  expect(getErrorMessageP().textContent).toBe('Unmatched "]" in structure.');
});

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
