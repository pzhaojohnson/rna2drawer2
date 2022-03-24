import { charactersAreGUTPair } from './charactersAreGUTPair';

describe('charactersAreGUTPair function', () => {
  test('GU pair', () => {
    expect(charactersAreGUTPair('G', 'U')).toBeTruthy();
    expect(charactersAreGUTPair('U', 'G')).toBeTruthy(); // switch order
  });

  test('GT pair', () => {
    expect(charactersAreGUTPair('G', 'T')).toBeTruthy();
    expect(charactersAreGUTPair('T', 'G')).toBeTruthy(); // switch order
  });

  it('is not case-sensitive', () => {
    expect(charactersAreGUTPair('g', 'u')).toBeTruthy();
    expect(charactersAreGUTPair('u', 'G')).toBeTruthy();
    expect(charactersAreGUTPair('G', 't')).toBeTruthy();
  });

  test('pairs that are not GU or GT', () => {
    expect(charactersAreGUTPair('A', 'U')).toBeFalsy();
    expect(charactersAreGUTPair('G', 'C')).toBeFalsy();
    expect(charactersAreGUTPair('C', 'A')).toBeFalsy();
  });

  test('IUPAC option', () => {
    // recognizes pairs involving K when set to true
    expect(charactersAreGUTPair('G', 'K', { IUPAC: true })).toBeTruthy();
    expect(charactersAreGUTPair('U', 'K', { IUPAC: true })).toBeTruthy();
    expect(charactersAreGUTPair('T', 'K', { IUPAC: true })).toBeTruthy();
    expect(charactersAreGUTPair('K', 'G', { IUPAC: true })).toBeTruthy();
    expect(charactersAreGUTPair('K', 'U', { IUPAC: true })).toBeTruthy();
    expect(charactersAreGUTPair('K', 'T', { IUPAC: true })).toBeTruthy();
    expect(charactersAreGUTPair('K', 'K', { IUPAC: true })).toBeTruthy();

    // otherwise does not recognize pairs involving K
    expect(charactersAreGUTPair('G', 'K', { IUPAC: false })).toBeFalsy();
    expect(charactersAreGUTPair('K', 'U', { IUPAC: false })).toBeFalsy();
    expect(charactersAreGUTPair('K', 'K', { IUPAC: false })).toBeFalsy();
  });
});
