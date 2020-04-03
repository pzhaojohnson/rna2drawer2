import {
  parseSequence,
  _isNumber,
  _isLetter,
  _isAUGCT,
  _isNonAlphanumeric,
} from './parseSequence';

it('_isNumber', () => {
  for (let cc = 0; cc < 48; cc++) {
    expect(_isNumber(String.fromCharCode(cc))).toBeFalsy();
  }
  for (let cc = 48; cc < 58; cc++) {
    expect(_isNumber(String.fromCharCode(cc))).toBeTruthy();
  }
  for (let cc = 58; cc < 128; cc++) {
    expect(_isNumber(String.fromCharCode(cc))).toBeFalsy();
  }
});

it('_isLetter', () => {
  for (let cc = 0; cc < 65; cc++) {
    expect(_isLetter(String.fromCharCode(cc))).toBeFalsy();
  }
  for (let cc = 65; cc < 91; cc++) {
    expect(_isLetter(String.fromCharCode(cc))).toBeTruthy();
  }
  for (let cc = 91; cc < 97; cc++) {
    expect(_isLetter(String.fromCharCode(cc))).toBeFalsy();
  }
  for (let cc = 97; cc < 123; cc++) {
    expect(_isLetter(String.fromCharCode(cc))).toBeTruthy();
  }
  for (let cc = 123; cc < 128; cc++) {
    expect(_isLetter(String.fromCharCode(cc))).toBeFalsy();
  }
});

it('_isAUGCT', () => {
  let augct = [65, 97, 85, 117, 71, 103, 67, 99, 84, 116];
  augct.forEach(cc => {
    expect(_isAUGCT(String.fromCharCode(cc))).toBeTruthy();
  });
  for (let cc = 0; cc < 128; cc++) {
    if (!augct.includes(cc)) {
      expect(_isAUGCT(String.fromCharCode(cc))).toBeFalsy();
    }
  }
});

it('_isNonAlphanumeric - a letter', () => {
  expect(_isNonAlphanumeric('g')).toBeFalsy();
});

it('_isNonAlphanumeric - a number', () => {
  expect(_isNonAlphanumeric('3')).toBeFalsy();
});

it('_isNonAlphanumeric - a non-alphanumeric', () => {
  expect(_isNonAlphanumeric('.')).toBeTruthy();
});

it('parseSequence - empty input', () => {

  // empty string
  expect(parseSequence('')).toBe('');

  // only whitespace
  expect(parseSequence('  \n\n\t\t\r \r\n ')).toBe('');
})

it('parseSequence - ignore whitespace', () => {

  // no whitespace
  expect(parseSequence('AAA')).toBe('AAA');

  // whitespace in lots of places
  expect(parseSequence(
    ' \n\t  \t AU  \t \n\r \r\r\r   \n\n\n \t\t\t GC  \t\t \n\r\n \t'
  )).toBe('AUGC');
});

it('parseSequence - ignoreNumbers', () => {
  expect(parseSequence(
    '1au234ggc0056ac789tgc',
    { ignoreNumbers: true }
  )).toBe('auggcactgc');

  expect(parseSequence(
    '1au234ggc0056ac789tgc',
    { ignoreNumbers: false }
  )).toBe('1au234ggc0056ac789tgc');
});

it('parseSequence - ignoreNonAUGCTLetters', () => {
  expect(parseSequence(
    'iIaAnNgGkkCcopUTtuzx',
    { ignoreNonAUGCTLetters: true }
  )).toBe('aAgGCcUTtu');
  
  expect(parseSequence(
    'iIaAnNgGkkCcopUTtuzx',
    { ignoreNonAUGCTLetters: false }
  )).toBe('iIaAnNgGkkCcopUTtuzx');
});

it('parseSequence - ignoreNonAlphanumerics', () => {
  expect(parseSequence(
    '<>!AaGGGwer()...CCc',
    { ignoreNonAlphanumerics: true }
  )).toBe('AaGGGwerCCc');

  expect(parseSequence(
    '<>!AaGGGwer()...CCc',
    { ignoreNonAlphanumerics: false }
  )).toBe('<>!AaGGGwer()...CCc');
});

it('parseSequence - ignore everything at once', () => {
  expect(parseSequence(
    'a  \tTACS 12  ..sD<. \n\r\n \t 213kdxccgGCU ahdUWwEjrsjd \r\n',
    {
      ignoreNumbers: true,
      ignoreNonAUGCTLetters: true,
      ignoreNonAlphanumerics: true,
    },
  )).toBe('aTACccgGCUaU');
});
