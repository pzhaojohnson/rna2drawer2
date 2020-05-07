import {
  parseCt,
  numSequencesInCT,
  _lineShouldBeIgnored,
  _headerLineIndex,
  _letter,
  _partner,
  _numberingOffset,
  _parseSequence,
  _parsePartners,
  _parseNumberingOffset,
  _numSequences,
} from './parseCt';
const fs = require('fs');
import parseDotBracket from './parseDotBracket';

it('_lineShouldBeIgnored - an empty line', () => {
  expect(_lineShouldBeIgnored('')).toBeTruthy();
});

it('_lineShouldBeIgnored - all whitespace', () => {
  expect(_lineShouldBeIgnored(' \t  \t')).toBeTruthy();
});

it('_lineShouldBeIgnored - a comment', () => {
  expect(_lineShouldBeIgnored('#asdf')).toBeTruthy();
});

it('_lineShouldBeIgnored - should not be ignored', () => {
  expect(_lineShouldBeIgnored('12')).toBeFalsy();
});

it('_headerLineIndex - no lines', () => {
  expect(_headerLineIndex([])).toBe(null);
});

it('_headerLineIndex - all lines should be ignored', () => {
  expect(_headerLineIndex([
    '',
    '  ',
    ' \t\t',
    '\t  ',
    ' #asdf',
    '#uthau\t\t',
    '\t#wer',
  ])).toBe(null);
});

it('_headerLineIndex - first line is header line', () => {
  expect(_headerLineIndex([
    '124\tdG',
    '1\t2\t3\t4\t5\t6',
  ])).toBe(0);
});

it('_headerLineIndex - a middle line is the header line', () => {
  expect(_headerLineIndex([
    '#asdf',
    '#werq',
    '',
    ' ',
    '\t',
    '100    dG',
    '1 2 3 4 5 6',
  ])).toBe(5);
});

it('_letter - empty string', () => {
  expect(_letter('')).toBe(null);
});

it('_letter - letter not present', () => {
  expect(_letter('2\t')).toBe(null);
});

it('_letter - multiple characters', () => {
  expect(_letter('1\tas')).toBe(null);
});

it('_letter - returns correct letter', () => {
  expect(_letter('1\tb')).toBe('b');
});

it('_letter - additional items present', () => {
  expect(_letter('\t2    P\t1   23  \t12\t  34')).toBe('P');
});

it('_parseSequence - empty string', () => {
  expect(_parseSequence('')).toBe(null);
});

it('_parseSequence - no header line', () => {
  expect(_parseSequence(
    '  \n'
    + '\n'
    + '\t\t\t\n'
    + '#qwer\n'
    + '\t '
  )).toBe(null);
});

it('_parseSequence - no body lines', () => {
  expect(_parseSequence(
    '128\tdG'
  )).toBe('');
});

it('_parseSequence - returns correct sequence', () => {
  expect(_parseSequence(
    '\r'
    + '12\tdG\r\n'
    + '1\ta\n'
    + '2 e\t5\n'
    + '3\tQ 12\n'
  )).toBe('aeQ');
});

it('_parseSequence - no lines after body', () => {
  expect(_parseSequence(
    '12\tdG\n'
    + '1\te\n'
    + '2\tf'
  )).toBe('ef');
});

it('_parseSequence - some lines after body', () => {
  expect(_parseSequence(
    '55 dG\n'
    + '1 t\n'
    + '2 h\n'
    + ' #thn\n'
    + '\n'
    + '3 e\n'
  )).toBe('th');
});

it('_partner - empty string', () => {
  expect(_partner('')).toBe(null);
});

it('_partner - partner not present', () => {
  expect(_partner('1\t2\t3\t4\t')).toBe(null);
});

it('_partner - not a number', () => {
  expect(_partner('1\t2\t3\t4\ta')).toBe(null);
});

it('_partner - parseInt function is not being used', () => {
  expect(_partner('1\t2\t3\t4\t12a')).toBe(null);
});

it('_partner - not an integer', () => {
  expect(_partner('1\t2\t3\t4\t1.1')).toBe(null);
});

it('_partner - partner is zero', () => {
  expect(_partner('1\t2\t3\t4\t0')).toBe(null);
});

it('_partner - returns the correct partner', () => {
  expect(_partner('1\t2\t3\t4\t10')).toBe(10);
});

it('_partner - additional items present', () => {
  expect(_partner('1\t2\t3\t4\t12\t1')).toBe(12);
});

it('_parsePartners - empty string', () => {
  expect(_parsePartners('')).toBe(null);
});

it('_parsePartners - no header line', () => {
  expect(_parsePartners(
    '\t\n'
    + '\n'
    + ' #asdf\n'
  )).toBe(null);
});

it('_parsePartners - no body lines', () => {
  let partners = _parsePartners('11 dG');
  expect(partners.length).toBe(0);
});

it('_parsePartners - invalid structure', () => {
  let partners = _parsePartners(
    '23 dG\n'
    + '1 a 3 4 4\n'
    + '2 b 3 4 0\n'
    + '3 c 3 4 0\n'
    + '4 d 3 4 0'
  );
  expect(partners).toBe(null);
});

it('_parsePartners - returns correct partners notation', () => {
  let partners = _parsePartners(
    '23 dG\n'
    + '1 a 3 4 4\n'
    + '2 b 3 4 0\n'
    + '3 c 3 4 0\n'
    + '4 d 3 4 1'
  );
  expect(partners.length).toBe(4);
  expect(partners[0]).toBe(4);
  expect(partners[1]).toBe(null);
  expect(partners[2]).toBe(null);
  expect(partners[3]).toBe(1);
});

it('_parsePartners - no lines after body', () => {
  let partners = _parsePartners(
    '55 dG\n'
    + '1 a 3 4 0\n'
    + '2 e 3 4 0'
  );
  expect(partners.length).toBe(2);
  expect(partners[0]).toBe(null);
  expect(partners[1]).toBe(null);
});

it('_parsePartners - some lines after body', () => {
  let partners = _parsePartners(
    '55 dG\n'
    + '1 a 3 4 0\n'
    + '2 e 3 4 0\n'
    + '  # wer\n'
    + '\n'
    + '3 g 3 4 0'
  );
  expect(partners.length).toBe(2);
  expect(partners[0]).toBe(null);
  expect(partners[1]).toBe(null);
});

it('_numberingOffset - empty string', () => {
  expect(_numberingOffset('')).toBe(0);
});

it('_numberingOffset - not present', () => {
  expect(_numberingOffset('1\t2\t3\t4\t5\t')).toBe(0);
});

it('_numberingOffset - position or offset position are not numbers', () => {
  expect(_numberingOffset('a\t2\t3\t4\t5\t6')).toBe(0);
  expect(_numberingOffset('1\t2\t3\t4\t5\tb')).toBe(0);
});

it('_numberingOffset - parseInt function is not being used', () => {
  expect(_numberingOffset('34c\t2\t3\t4\t5\t6')).toBe(0);
  expect(_numberingOffset('1\t2\t3\t4\t5\t10e')).toBe(0);
});

it('_numberingOffset - position or offset position are not integers', () => {
  expect(_numberingOffset('6.01\t2\t3\t4\t5\t6')).toBe(0);
  expect(_numberingOffset('1\t2\t3\t4\t5\t1.02')).toBe(0);
});

it('_numberingOffset - zero offset', () => {
  expect(_numberingOffset('7\t2\t3\t4\t5\t7')).toBe(0);
});

it('_numberingOffset - positive offset', () => {
  expect(_numberingOffset('7\t2\t3\t4\t5\t17')).toBe(10);
});

it('_numberingOffset - negative offset', () => {
  expect(_numberingOffset('12\t2\t3\t4\t5\t5')).toBe(-7);
});

it('_parseNumberingOffset - empty string', () => {
  expect(_parseNumberingOffset('')).toBe(0);
});

it('_parseNumberingOffset - no header line', () => {
  expect(_parseNumberingOffset(
    '#blah\n'
    + '#qwer\n'
    + '\n'
  )).toBe(0);
});

it('_parseNumberingOffset - no lines after header line', () => {
  expect(_parseNumberingOffset(
    '12 dG'
  )).toBe(0);
});

it('_parseNumberingOffset - lines after header line are not body lines', () => {
  expect(_parseNumberingOffset(
    '12 dG\n'
    + '#asd 3 4 5 6 7 8 9\n'
    + '1 e 3 4 5 6\n'
    + '   '
  )).toBe(0);
});

it('_parseNumberingOffset - returns correct offset', () => {
  expect(_parseNumberingOffset(
    '12 dG\n'
    + '5 A 3 4 3 12'
  )).toBe(7);
});

it('parseCt - empty string', () => {
  expect(parseCt('')).toBe(null);
});

it('parseCt - zero sequeces', () => {
  expect(parseCt(
    '#blah\n'
    + ' #asdf\n'
    + '   '
  )).toBe(null);
});

it('parseCt - multiple sequences', () => {
  expect(parseCt(
    '128\t3 dG'
  )).toBe(null);
});

it('parseCt - sequence cannot be parsed', () => {
  expect(parseCt(
    '128 1  dG\n'
    + ' 1 a 3 4 0\n'
    + '2 er 3 4 0'
  )).toBe(null);
});

it('parseCt - structure cannot be parsed', () => {
  expect(parseCt(
    '11 dG\n'
    + '1 a 3 4 3\n'
    + '2 g 3 4 0'
  )).toBe(null);
});

it('parseCt - returns correct sequence, structure, and numbering offset', () => {
  let parsed = parseCt(
    '34 dG\n'
    + '1 q 3 4 4 -4\n'
    + '2 w 3 4 0 -3\n'
    + '3 e 3 4 0 -2\n'
    + '4 r 3 4 1 -1'
  );
  expect(parsed.sequence).toBe('qwer');
  expect(parsed.partners.length).toBe(4);
  expect(parsed.partners[0]).toBe(4);
  expect(parsed.partners[1]).toBe(null);
  expect(parsed.partners[2]).toBe(null);
  expect(parsed.partners[3]).toBe(1);
  expect(parsed.numberingOffset).toBe(-5);
});

it('parseCt - a CT file downloaded from Mfold', () => {
  let data = fs.readFileSync('testinput/ct/ct0.ct', 'utf8');
  let parsed = parseCt(data);
  expect(parsed.sequence).toBe('aaagucgcgcuggcacaggacgaagucgca');
  let epartners = parseDotBracket('......(((((............)).))).').secondaryPartners;
  expect(parsed.partners.length).toBe(epartners.length);
  for (let i = 0; i < epartners.length; i++) {
    expect(parsed.partners[i]).toBe(epartners[i]);
  }
  expect(parsed.numberingOffset).toBe(12);
});

it('_numSequences - empty string', () => {
  expect(_numSequences('')).toBe(1);
});

it('_numSequences - no second item', () => {
  expect(_numSequences('128\t')).toBe(1);
});

it('_numSequences - second item is not a number', () => {
  expect(_numSequences('\t128 f')).toBe(1);
});

it('_numSequences - parseInt function is not used', () => {
  expect(_numSequences('128\t5a')).toBe(1);
});

it('_numSequences - second item is not an integer', () => {
  expect(_numSequences('12\t2.99')).toBe(1);
});

it('_numSequences - does not return a number less than one', () => {
  expect(_numSequences('12 0')).toBe(1);
  expect(_numSequences('12 -1')).toBe(1);
});

it('_numSequences - returns the correct number', () => {
  expect(_numSequences('12 3')).toBe(3);
});

it('_numSequences - more than two items', () => {
  expect(_numSequences('\t12\t4\tdG [blah]\n')).toBe(4);
});

it('numSequencesInCT - empty string', () => {
  expect(numSequencesInCT('')).toBe(0);
});

it('numSequencesInCT - no header line', () => {
  expect(numSequencesInCT(
    '#asdf\n'
    + '\n'
    + ' #wer\n'
    + '\t\t\t'
  )).toBe(0);
});

it('numSequencesInCT - returns correct number', () => {
  expect(numSequencesInCT(
    '#qwerty\n'
    + '12\t2 3 4 5 dG\n'
    + '1 w 3 4 0 1'
  )).toBe(2);
});
