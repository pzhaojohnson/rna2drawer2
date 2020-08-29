import * as React from 'react';
import { render } from 'react-dom';
import { act } from 'react-dom/test-utils';
import { fireEvent } from '@testing-library/react';
import { SequenceParsingDetails } from './SequenceParsingDetails';

let container = document.createElement('div');
document.body.appendChild(container);

let ignoreNumbers = jest.fn();
let ignoreNonAugctLetters = jest.fn();
let ignoreNonAlphanumerics = jest.fn();

act(() => {
  render(
    <SequenceParsingDetails
      ignoringNumbers={true}
      ignoreNumbers={ignoreNumbers}
      ignoringNonAugctLetters={false}
      ignoreNonAugctLetters={ignoreNonAugctLetters}
      ignoringNonAlphanumerics={true}
      ignoreNonAlphanumerics={ignoreNonAlphanumerics}
    />,
    container,
  );
});

let checkboxesContainer = container.childNodes[0].childNodes[1];
let ignoreNumbersCheckbox = checkboxesContainer.childNodes[1].getElementsByTagName('input')[0];
let ignoreNonAugctLettersCheckbox = checkboxesContainer.childNodes[2].getElementsByTagName('input')[0];
let ignoreNonAlphanumericsCheckbox = checkboxesContainer.childNodes[3].getElementsByTagName('input')[0];

it('ignore numbers checkbox', () => {
  expect(ignoreNumbersCheckbox.checked).toBeTruthy();
  act(() => fireEvent.click(ignoreNumbersCheckbox, { bubbles: true }));
  expect(ignoreNumbers.mock.calls[0][0]).toBe(false);
  act(() => fireEvent.click(ignoreNumbersCheckbox, { bubbles: true }));
  expect(ignoreNumbers.mock.calls[1][0]).toBe(true);
});

it('ignore non-AUGCT letters checkbox', () => {
  expect(ignoreNonAugctLettersCheckbox.checked).toBeFalsy();
  act(() => fireEvent.click(ignoreNonAugctLettersCheckbox, { bubbles: true }));
  expect(ignoreNonAugctLetters.mock.calls[0][0]).toBe(true);
  act(() => fireEvent.click(ignoreNonAugctLettersCheckbox, { bubbles: true }));
  expect(ignoreNonAugctLetters.mock.calls[1][0]).toBe(false);
});

it('ignore non-alphanumerics checkbox', () => {
  expect(ignoreNonAlphanumericsCheckbox.checked).toBeTruthy();
  act(() => fireEvent.click(ignoreNonAlphanumericsCheckbox, { bubbles: true }));
  expect(ignoreNonAlphanumerics.mock.calls[0][0]).toBe(false);
  act(() => fireEvent.click(ignoreNonAlphanumericsCheckbox, { bubbles: true }));
  expect(ignoreNonAlphanumerics.mock.calls[1][0]).toBe(true);
});
