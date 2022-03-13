import { motifsAreComplementary } from './motifsAreComplementary';

describe('motifsAreComplementary function', () => {
  test('perfect complements', () => {
    expect(motifsAreComplementary('AUGC', 'GCAU')).toBeTruthy();
    expect(motifsAreComplementary('gc', 'gc')).toBeTruthy();
  });

  it('is not case-sensitive', () => {
    expect(motifsAreComplementary('augc', 'GCAU')).toBeTruthy();
    expect(motifsAreComplementary('GC', 'gc')).toBeTruthy();
  });

  test('non-complementary motifs', () => {
    // edge characters are mismatched
    expect(motifsAreComplementary('AAAA', 'UUUA')).toBeFalsy();
    expect(motifsAreComplementary('GGGG', 'GCCC')).toBeFalsy();
    // intervening characters are mismatched
    expect(motifsAreComplementary('UUUUU', 'AACAA')).toBeFalsy();
  });

  test('motifs of different lengths', () => {
    expect(motifsAreComplementary('AUGC', 'GCA')).toBeFalsy();
    expect(motifsAreComplementary('G', 'CG')).toBeFalsy();
  });

  test('two motifs of length zero', () => {
    expect(motifsAreComplementary('', '')).toBeTruthy();
  });

  test('GUT option', () => {
    // when set to true
    expect(motifsAreComplementary('UT', 'gg', { GUT: true })).toBeTruthy();
    // when set to false
    expect(motifsAreComplementary('UT', 'gg', { GUT: false })).toBeFalsy();
    // when left unspecified
    expect(motifsAreComplementary('UT', 'gg')).toBeFalsy();
  });

  test('IUPAC option', () => {
    // when set to true
    expect(motifsAreComplementary('R', 'c', { IUPAC: true })).toBeTruthy();
    expect(motifsAreComplementary('AA', 'YY', { IUPAC: true })).toBeTruthy();
    expect(motifsAreComplementary('AGNA', 'U1CU', { IUPAC: true })).toBeTruthy();
    // when set to false
    expect(motifsAreComplementary('R', 'c', { IUPAC: false })).toBeFalsy();
    expect(motifsAreComplementary('AA', 'YY', { IUPAC: false })).toBeFalsy();
    expect(motifsAreComplementary('AGNA', 'U1CU', { IUPAC: false })).toBeFalsy();
    // when left unspecified
    expect(motifsAreComplementary('R', 'c')).toBeFalsy();
  });

  test('mismatchesAllowed option', () => {
    // when specified
    expect(motifsAreComplementary('AbGCAU', 'AhGCAU', { mismatchesAllowed: 0 })).toBeFalsy();
    expect(motifsAreComplementary('AbGCAU', 'AhGCAU', { mismatchesAllowed: 1 })).toBeFalsy();
    expect(motifsAreComplementary('AbGCAU', 'AhGCAU', { mismatchesAllowed: 2 })).toBeTruthy();
    expect(motifsAreComplementary('AbGCAU', 'AhGCAU', { mismatchesAllowed: 3 })).toBeTruthy();
    // when left unspecified
    expect(motifsAreComplementary('AbGCAU', 'AhGCAU')).toBeFalsy();
  });
});
