import { readFileSync } from 'fs';

import { parseCTString } from './parseCTString';

function readValidExampleFileSync(fileName) {
  let filePath = 'src/forms/new/ct/examples/valid/' + fileName;
  let fileContents = readFileSync(filePath, 'utf8');

  // in case a buffer was returned instead of a string
  if (typeof fileContents !== 'string') {
    throw new Error(
      `The contents of ${fileName} could not be read in as a string.`
    );
  }

  return fileContents;
}

function readInvalidExampleFileSync(fileName) {
  let filePath = 'src/forms/new/ct/examples/invalid/' + fileName;
  let fileContents = readFileSync(filePath, 'utf8');

  // in case a buffer was returned instead of a string
  if (typeof fileContents !== 'string') {
    throw new Error(
      `The contents of ${fileName} could not be read in as a string.`
    );
  }

  return fileContents;
}

describe('parseCTString function', () => {
  test('a small structure', () => {
    let ctString = readValidExampleFileSync('small-structure.ct');
    let ctData = parseCTString(ctString);
    expect(ctData).toStrictEqual({
      sequenceId: 'dG = -8.50 [Initially -8.50] CYVaV-Delta',
      sequence: 'gcguugaaaggggaggaggcugauccucgugcaauccaac',
      partners: [
        null, null,
        35, 34, 33, 32,
        null, null, null,
        28, 27, 26, 25, 24,
        null, null, null, null, null, null, null, null, null,
        14, 13, 12, 11, 10,
        null, null, null,
        6, 5, 4, 3,
        null, null, null, null, null,
      ],
      numberingOffset: 0,
    });
  });

  test('extra blank lines', () => {
    let ctString = readValidExampleFileSync('extra-blank-lines.ct');
    let ctData = parseCTString(ctString);
    expect(ctData).toStrictEqual({
      sequenceId: 'dG = -8.50 [Initially -8.50] CYVaV-Delta',
      sequence: 'gcguugaaaggggaggaggcugauccucgugcaauccaac',
      partners: [
        null, null,
        35, 34, 33, 32,
        null, null, null,
        28, 27, 26, 25, 24,
        null, null, null, null, null, null, null, null, null,
        14, 13, 12, 11, 10,
        null, null, null,
        6, 5, 4, 3,
        null, null, null, null, null,
      ],
      numberingOffset: 0,
    });
  });

  test('comments', () => {
    let ctString = readValidExampleFileSync('comments.ct');
    let ctData = parseCTString(ctString);
    expect(ctData).toStrictEqual({
      sequenceId: 'dG = 0.80 [Initially 0.60] Asdf',
      sequence: 'gaccuuguuacuaccaaccccucgugcaca',
      partners: [
        null, null, null, null, null,
        30, 29, 28,
        26, 25, 24,
        null, null, null, null, null, null, null, null, null, null, null, null,
        11, 10, 9,
        null,
        8, 7, 6,
      ],
      numberingOffset: 0,
    });
  });

  test('extra whitespace within lines', () => {
    let fileName = 'extra-whitespace-within-lines.ct';
    let ctString = readValidExampleFileSync(fileName);
    let ctData = parseCTString(ctString);
    expect(ctData).toStrictEqual({
      sequenceId: 'dG = 0.80 [Initially 0.60] Asdf',
      sequence: 'gaccuuguuacuaccaaccccucgugcaca',
      partners: [
        null, null, null, null, null,
        30, 29, 28,
        26, 25, 24,
        null, null, null, null, null, null, null, null, null, null, null, null,
        11, 10, 9,
        null,
        8, 7, 6,
      ],
      numberingOffset: 0,
    });
  });

  test('extra position lines', () => {
    let ctString = readValidExampleFileSync('extra-position-lines.ct');
    let ctData = parseCTString(ctString);
    // extra position lines should be ignored
    expect(ctData).toStrictEqual({
      sequenceId: 'dG = -12.70 [Initially -12.70] QWER',
      sequence: 'gccgacagcguacucguuacgcucaagccgucgagcagcu',
      partners: [
        36, 35,
        33, 32, 31, 30,
        23, 22, 21, 20, 19, 18,
        null, null, null, null, null,
        12, 11, 10, 9, 8, 7,
        null, null, null, null, null, null,
        6, 5, 4, 3,
        null,
        2, 1,
        null, null, null, null,
      ],
      numberingOffset: 0,
    });
  });

  test('missing sequence ID', () => {
    let ctString = readValidExampleFileSync('missing-sequence-id.ct');
    let ctData = parseCTString(ctString);
    expect(ctData.sequenceId).toBe('Structure');
  });

  test('extra whitespace in and around the sequence ID', () => {
    let fileName = 'extra-whitespace-in-and-around-sequence-id.ct';
    let ctString = readValidExampleFileSync(fileName);
    let ctData = parseCTString(ctString);
    // ignores leading and trailing whitespace
    // keeps whitespace inside the sequence ID
    expect(ctData.sequenceId).toBe(
      'dG = -140.09\t  [Initially -145.00]   \t A Long Name'
    );
  });

  test('invalid partner positions', () => {
    let ctString = readValidExampleFileSync('invalid-partner-positions.ct');
    let ctData = parseCTString(ctString);
    // invalid partner positions should be ignored
    expect(ctData).toStrictEqual({
      sequenceId: 'dG = -12.70 [Initially -12.70] QWER',
      sequence: 'gccgacagcguacucguuacgcucaagccgucgagcagcu',
      partners: [
        36,
        null,
        33, 32,
        null,
        30,
        23,
        null, null, null,
        19,
        null, null, null, null, null, null, null,
        11,
        null, null, null,
        7,
        null, null, null, null, null, null,
        6,
        null,
        4, 3,
        null, null,
        1,
        null, null, null, null,
      ],
      numberingOffset: 0,
    });
  });

  test('disagreeing pairs', () => {
    let ctString = readValidExampleFileSync('disagreeing-pairs.ct');
    let ctData = parseCTString(ctString);
    // should go with whatever pairs come later
    expect(ctData).toStrictEqual({
      sequenceId: 'dG = -12.70 [Initially -12.70] QWER',
      sequence: 'gccgacagcguacucguuacgcucaagccgucgagcagcu',
      partners: [
        36, 35,
        33, 32, 31, 30,
        23, 22, 21, 20, 19, 18,
        null,
        29,
        null, null, null,
        12, 11, 10, 9, 8, 7,
        null, null, null, null, null,
        14,
        6, 5, 4, 3,
        null,
        2, 1,
        null, null, null, null,
      ],
      numberingOffset: 0,
    });
  });

  test('positive numbering offset', () => {
    let ctString = readValidExampleFileSync('positive-numbering-offset.ct');
    let ctData = parseCTString(ctString);
    expect(ctData.numberingOffset).toBe(356);
  });

  test('negative numbering offset', () => {
    let ctString = readValidExampleFileSync('negative-numbering-offset.ct');
    let ctData = parseCTString(ctString);
    expect(ctData.numberingOffset).toBe(-1054);
  });

  test('missing numbering offset', () => {
    let ctString = readValidExampleFileSync('missing-numbering-offset.ct');
    let ctData = parseCTString(ctString);
    expect(ctData.numberingOffset).toBe(0);
  });

  test('nonnumeric numbering offset', () => {
    let ctString = readValidExampleFileSync('nonnumeric-numbering-offset.ct');
    let ctData = parseCTString(ctString);
    expect(ctData.numberingOffset).toBe(0);
  });

  test('non-integer numbering offset', () => {
    let ctString = readValidExampleFileSync('non-integer-numbering-offset.ct');
    let ctData = parseCTString(ctString);
    expect(ctData.numberingOffset).toBe(0);
  });

  test('multiple structures', () => {
    let ctString = readValidExampleFileSync('multiple-structures.ct');
    let ctData = parseCTString(ctString);
    // should ignore structures after the first one
    expect(ctData.sequence.length).toBe(65);
    expect(ctData.partners.length).toBe(65);
  });

  test('no tab characters', () => {
    let ctString = readValidExampleFileSync('no-tab-characters.ct');
    let ctData = parseCTString(ctString);
    expect(ctData).toStrictEqual({
      sequenceId: 'dG = -5.10 [Initially -5.10] Q',
      sequence: 'ccccaguauggacugagagggg',
      partners: [
        22, 21, 20, 19,
        14, 13, 12,
        null, null, null, null,
        7, 6, 5,
        null, null, null, null,
        4, 3, 2, 1,
      ],
      numberingOffset: 0,
    });
  });

  test('no trailing newline character', () => {
    let fileName = 'no-trailing-newline-character.ct';
    let ctString = readValidExampleFileSync(fileName);
    let ctData = parseCTString(ctString);
    expect(ctData).toStrictEqual({
      sequenceId: 'dG = -5.10 [Initially -5.10] Q',
      // still parsed the last base character
      sequence: 'ccccaguauggacugagagggg',
      // still parsed the last partner position
      partners: [
        22, 21, 20, 19,
        14, 13, 12,
        null, null, null, null,
        7, 6, 5,
        null, null, null, null,
        4, 3, 2, 1,
      ],
      numberingOffset: 0,
    });
  });

  test('invalid inputs', () => {
    [
      'empty.ct',
      'blank.ct',
      'all-comments.ct',
      'no-line-starts-with-a-number.ct',
      'zero-sequence-length.ct',
      'negative-sequence-length.ct',
      'non-integer-sequence-length.ct',
      'missing-position-lines.ct',
      'position-line-missing-character.ct',
      'position-line-with-multiple-characters.ct',
    ].forEach(fileName => {
      let ctString = readInvalidExampleFileSync(fileName);
      expect(() => parseCTString(ctString)).toThrow();
    });
  });
});
