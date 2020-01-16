import parseSequence from './parseSequence';

it('contradictory options', () => {
  
  // case conversion
  expect(() => parseSequence('asdf', { toUpperCase: true, toLowerCase: true })).toThrow();
  expect(() => parseSequence('asdf', { toUpperCase: true, toLowerCase: false })).not.toThrow();
  expect(() => parseSequence('asdf', { toUpperCase: false, toLowerCase: true })).not.toThrow();
  expect(() => parseSequence('asdf', { toUpperCase: false, toLowerCase: false })).not.toThrow();

  // T and U conversion
  expect(() => parseSequence('asdf', { t2u: true, u2t: true })).toThrow();
  expect(() => parseSequence('asdf', { t2u: true, u2t: false })).not.toThrow();
  expect(() => parseSequence('asdf', { t2u: false, u2t: true })).not.toThrow();
  expect(() => parseSequence('asdf', { t2u: false, u2t: false })).not.toThrow();
});

it('empty input', () => {

  // empty string
  expect(parseSequence('')).toBe('');

  // only whitespace
  expect(parseSequence('  \n\n\t\t\r \r\n ')).toBe('');
})

it('ignore whitespace', () => {

  // no whitespace
  expect(parseSequence('AAA')).toBe('AAA');

  // whitespace in lots of places
  expect(parseSequence(
    ' \n\t  \t AU  \t \n\r \r\r\r   \n\n\n \t\t\t GC  \t\t \n\r\n \t'
  )).toBe('AUGC');
});

it('toUpperCase', () => {

  // non-AUGCT letters are turned to upper case as well
  expect(parseSequence(
    'AaUUuuuggCCcIiNNn',
    { toUpperCase: true }
  )).toBe('AAUUUUUGGCCCIINNN');
});

it('toLowerCase', () => {

  // non-AUGCT letters are turned to lower case as well
  expect(parseSequence(
    'AaUUuuuggCCcIiNNn',
    { toLowerCase: true }
  )).toBe('aauuuuuggccciinnn');
});

it('t2u', () => {

  // must handle upper and lower case Ts (and account for their case)

  expect(parseSequence(
    'AATtUGCt',
    { t2u: true }
  )).toBe('AAUuUGCu');
  
  expect(parseSequence(
    'AATtUGCt',
    { t2u: true, toUpperCase: true }
  )).toBe('AAUUUGCU');

  expect(parseSequence(
    'AATtUGCt',
    { t2u: true, toLowerCase: true }
  )).toBe('aauuugcu');
});

it('u2t', () => {

  // must handle upper and lower case Us (and account for their case)

  expect(parseSequence(
    'AAUuTGCu',
    { u2t: true }
  )).toBe('AATtTGCt');
  
  expect(parseSequence(
    'AAUuTGCu',
    { u2t: true, toUpperCase: true }
  )).toBe('AATTTGCT');

  expect(parseSequence(
    'AAUuTGCu',
    { u2t: true, toLowerCase: true }
  )).toBe('aatttgct');
});

it('ignoreNumbers', () => {
  expect(parseSequence(
    '1au234ggc0056ac789tgc',
    { ignoreNumbers: true }
  )).toBe('auggcactgc');

  expect(parseSequence(
    '1au234ggc0056ac789tgc',
    { ignoreNumbers: false }
  )).toBe('1au234ggc0056ac789tgc');
});

it('ignoreNonAUGCTLetters', () => {

  // must handle upper and lower case versions of letters

  expect(parseSequence(
    'iIaAnNgGkkCcopUTtuzx',
    { ignoreNonAUGCTLetters: true }
  )).toBe('aAgGCcUTtu');

  expect(parseSequence(
    'iIaAnNgGkkCcopUTtuzx',
    { ignoreNonAUGCTLetters: false }
  )).toBe('iIaAnNgGkkCcopUTtuzx');
});

it('ignoreNonAlphanumerics', () => {
  expect(parseSequence(
    '<>!AaGGGwer()...CCc',
    { ignoreNonAlphanumerics: true }
  )).toBe('AaGGGwerCCc');

  expect(parseSequence(
    '<>!AaGGGwer()...CCc',
    { ignoreNonAlphanumerics: false }
  )).toBe('<>!AaGGGwer()...CCc');
});
