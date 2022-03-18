import { motifsMatch } from './motifsMatch';

describe('motifsMatch function', () => {
  test('perfect matches', () => {
    expect(motifsMatch('AUGC', 'AUGC')).toBeTruthy();
    expect(motifsMatch('gc', 'gc')).toBeTruthy();
  });

  it('is not case-sensitive', () => {
    expect(motifsMatch('augc', 'AUGC')).toBeTruthy();
    expect(motifsMatch('GC', 'gc')).toBeTruthy();
  });

  test('non-matching motifs', () => {
    // first characters are mismatched
    expect(motifsMatch('AAAA', 'UAAA')).toBeFalsy();
    // last characters are mismatched
    expect(motifsMatch('GGGG', 'GGGC')).toBeFalsy();
    // intervening characters are mismatched
    expect(motifsMatch('UUUUU', 'UUCUU')).toBeFalsy();
  });

  test('motifs of different lengths', () => {
    expect(motifsMatch('AUGC', 'AUG')).toBeFalsy();
    expect(motifsMatch('G', 'GC')).toBeFalsy();
  });

  test('two motifs of length zero', () => {
    expect(motifsMatch('', '')).toBeTruthy();
  });

  test('UT option', () => {
    // when set to true
    expect(motifsMatch('UT', 'tu', { UT: true })).toBeTruthy();
    // when set to false
    expect(motifsMatch('UT', 'tu', { UT: false })).toBeFalsy();
    // when left unspecified
    expect(motifsMatch('UT', 'tu')).toBeFalsy();
  });

  test('IUPAC option', () => {
    // when set to true
    expect(motifsMatch('R', 'A', { IUPAC: true })).toBeTruthy();
    expect(motifsMatch('CC', 'YY', { IUPAC: true })).toBeTruthy();
    expect(motifsMatch('AGNA', 'AG1A', { IUPAC: true })).toBeTruthy();
    // when set to false
    expect(motifsMatch('R', 'A', { IUPAC: false })).toBeFalsy();
    expect(motifsMatch('CC', 'YY', { IUPAC: false })).toBeFalsy();
    expect(motifsMatch('AGNA', 'AG1A', { IUPAC: false })).toBeFalsy();
    // when left unspecified
    expect(motifsMatch('R', 'A')).toBeFalsy();
  });

  test('allowedMismatch option', () => {
    // when specified
    expect(motifsMatch('bGCAU', 'UGhAU', { allowedMismatch: 0 })).toBeFalsy();
    expect(motifsMatch('bGCAU', 'UGhAU', { allowedMismatch: 0.2 })).toBeFalsy();
    expect(motifsMatch('bGCAU', 'UGhAU', { allowedMismatch: 0.4 })).toBeTruthy();
    expect(motifsMatch('bGCAU', 'UGhAU', { allowedMismatch: 0.6 })).toBeTruthy();
    expect(motifsMatch('bGCAU', 'UGhAU', { allowedMismatch: 1 })).toBeTruthy();
    // when left unspecified
    expect(motifsMatch('bGCAU', 'UGhAU')).toBeFalsy();
  });
});
