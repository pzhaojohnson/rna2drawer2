import { charactersAreComplementary } from './charactersAreComplementary';

describe('charactersAreComplementary function', () => {
  test('basic complements', () => {
    // some basic complements
    expect(charactersAreComplementary('a', 'u')).toBeTruthy();
    expect(charactersAreComplementary('T', 'A')).toBeTruthy();
    expect(charactersAreComplementary('G', 'C')).toBeTruthy();

    // some mismatches
    expect(charactersAreComplementary('A', 'A')).toBeFalsy();
    expect(charactersAreComplementary('c', 'a')).toBeFalsy();
  });

  it('is not case-sensitive', () => {
    expect(charactersAreComplementary('a', 'U')).toBeTruthy();
    expect(charactersAreComplementary('C', 'g')).toBeTruthy();
  });

  test('GUT option', () => {
    // when set to true
    expect(charactersAreComplementary('G', 'U', { GUT: true })).toBeTruthy();
    expect(charactersAreComplementary('t', 'g', { GUT: true })).toBeTruthy();
    // handles the special IUPAC single letter code K
    expect(charactersAreComplementary('g', 'k', { GUT: true, IUPAC: true })).toBeTruthy();
    expect(charactersAreComplementary('U', 'K', { GUT: true, IUPAC: true })).toBeTruthy();

    // when set to false
    expect(charactersAreComplementary('G', 'U', { GUT: false })).toBeFalsy();
    expect(charactersAreComplementary('t', 'g', { GUT: false })).toBeFalsy();
    // handles the special IUPAC single letter code K
    expect(charactersAreComplementary('g', 'k', { GUT: false, IUPAC: true })).toBeFalsy();
    expect(charactersAreComplementary('U', 'K', { GUT: false, IUPAC: true })).toBeFalsy();

    // when left unspecified
    expect(charactersAreComplementary('G', 'U')).toBeFalsy();
  });

  test('IUPAC option', () => {
    // when set to true
    expect(charactersAreComplementary('R', 'C', { IUPAC: true })).toBeTruthy();
    expect(charactersAreComplementary('r', 'y', { IUPAC: true })).toBeTruthy();
    expect(charactersAreComplementary('S', 's', { IUPAC: true })).toBeTruthy();
    expect(charactersAreComplementary('a', 'W', { IUPAC: true })).toBeTruthy();
    // N is complementary to anything
    expect(charactersAreComplementary('N', '1', { IUPAC: true })).toBeTruthy();
    expect(charactersAreComplementary('l', 'n', { IUPAC: true })).toBeTruthy();

    // when set to false
    expect(charactersAreComplementary('R', 'C', { IUPAC: false })).toBeFalsy();
    expect(charactersAreComplementary('r', 'y', { IUPAC: false })).toBeFalsy();
    expect(charactersAreComplementary('S', 's', { IUPAC: false })).toBeFalsy();
    expect(charactersAreComplementary('a', 'W', { IUPAC: false })).toBeFalsy();
    expect(charactersAreComplementary('N', '1', { IUPAC: false })).toBeFalsy();
    expect(charactersAreComplementary('l', 'n', { IUPAC: false })).toBeFalsy();

    // when left unspecified
    expect(charactersAreComplementary('N', 'A')).toBeFalsy();
  });
});
