import { parseInputs } from './parseInputs';

let inputs = null;

beforeEach(() => {
  inputs = {
    sequenceId: 'asdf',
    sequence: 'AUGCAUGCAUGC',
    ignoreNumbers: true,
    ignoreNonAugctLetters: false,
    ignoreNonAlphanumerics: true,
    dotBracket: '(((......)))',
  };
});

it('can parse sequence ID', () => {
  inputs.sequenceId = '  asdf  QWER  ';
  let parsed = parseInputs(inputs);
  expect(parsed.id).toBe('asdf  QWER');
});

it('sequence ID of length zero', () => {
  inputs.sequenceId = '';
  expect(typeof parseInputs(inputs)).toBe('string');
});

it('sequence ID is all whitespace', () => {
  inputs.sequenceId = '  \t\t  ';
  expect(typeof parseInputs(inputs)).toBe('string');
});

it('sequence of length zero', () => {
  inputs.sequence = '';
  expect(typeof parseInputs(inputs)).toBe('string');
});

it('sequence is all ignored characters', () => {
  inputs.sequence = '12345<<>>';
  inputs.ignoreNumbers = true;
  inputs.ignoreNonAlphanumerics = true;
  expect(typeof parseInputs(inputs)).toBe('string');
});

it('can exclude numbers, non-AUGCT letters and non-alphanumerics', () => {
  inputs.sequence = 'ag1235  <> : bbv ut cs ';
  inputs.ignoreNumbers = true;
  inputs.ignoreNonAugctLetters = true;
  inputs.ignoreNonAlphanumerics = true;
  inputs.dotBracket = '.....';
  let parsed = parseInputs(inputs);
  expect(parsed.sequence).toBe('agutc');
});

it('can include numbers, non-AUGCT letters and non-alphanumerics', () => {
  inputs.sequence = 'ab1156<>  gcq';
  inputs.ignoreNumbers = false;
  inputs.ignoreNonAugctLetters = false;
  inputs.ignoreNonAlphanumerics = false;
  inputs.dotBracket = '...........';
  let parsed = parseInputs(inputs);
  expect(parsed.sequence).toBe('ab1156<>gcq');
});

it('can parse secondary and tertiary partners', () => {
  inputs.sequence = 'aaacccuuuggg';
  inputs.dotBracket = '((({{{)))}}}';
  let parsed = parseInputs(inputs);
  expect(parsed.secondaryPartners).toStrictEqual([9, 8, 7, null, null, null, 3, 2, 1, null, null, null]);
  expect(parsed.tertiaryPartners).toStrictEqual([null, null, null, 12, 11, 10, null, null, null, 6, 5, 4]);
});

it('dot-bracket notation is nonempty and different length than sequence', () => {
  inputs.sequence = 'aaaaaa';
  inputs.dotBracket = '(((..)))';
  expect(typeof parseInputs(inputs)).toBe('string');
});

it('empty dot-bracket notation', () => {
  inputs.dotBracket = '  asdf  '; // only has ignored characters
  let parsed = parseInputs(inputs);
  expect(parsed.secondaryPartners).toBeFalsy();
  expect(parsed.tertiaryPartners).toBeFalsy();
});
