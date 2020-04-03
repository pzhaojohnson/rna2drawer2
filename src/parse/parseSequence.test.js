import parseSequence from './parseSequence';

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
