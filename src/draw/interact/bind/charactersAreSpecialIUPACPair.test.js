import { charactersAreSpecialIUPACPair } from './charactersAreSpecialIUPACPair';

describe('charactersAreSpecialIUPACPair function', () => {
  test('some special IUPAC pairs', () => {
    expect(charactersAreSpecialIUPACPair('R', 'Y')).toBeTruthy();
    expect(charactersAreSpecialIUPACPair('S', 'S')).toBeTruthy();
    expect(charactersAreSpecialIUPACPair('W', 'W')).toBeTruthy();
    expect(charactersAreSpecialIUPACPair('A', 'Y')).toBeTruthy();
    expect(charactersAreSpecialIUPACPair('W', 'U')).toBeTruthy();
    expect(charactersAreSpecialIUPACPair('C', 'S')).toBeTruthy();
  });

  it('is not case-sensitive', () => {
    expect(charactersAreSpecialIUPACPair('y', 'r')).toBeTruthy();
    expect(charactersAreSpecialIUPACPair('W', 'w')).toBeTruthy();
    expect(charactersAreSpecialIUPACPair('t', 'R')).toBeTruthy();
  });

  test('the single letter code N', () => {
    // N is complementary to anything
    expect(charactersAreSpecialIUPACPair('N', 'R')).toBeTruthy();
    expect(charactersAreSpecialIUPACPair('n', 'x')).toBeTruthy();
    expect(charactersAreSpecialIUPACPair('2', 'N')).toBeTruthy();
    expect(charactersAreSpecialIUPACPair('n', 'N')).toBeTruthy();
  });

  test('pairs that are not special IUPAC pairs', () => {
    expect(charactersAreSpecialIUPACPair('A', 'U')).toBeFalsy();
    expect(charactersAreSpecialIUPACPair('G', 'C')).toBeFalsy();
    expect(charactersAreSpecialIUPACPair('R', 'R')).toBeFalsy();
    expect(charactersAreSpecialIUPACPair('S', 'W')).toBeFalsy();
    expect(charactersAreSpecialIUPACPair('A', 'C')).toBeFalsy();
  });

  test('GUT option', () => {
    // when set to true
    expect(charactersAreSpecialIUPACPair('G', 'K', { GUT: true })).toBeTruthy();
    expect(charactersAreSpecialIUPACPair('k', 'U', { GUT: true })).toBeTruthy();
    expect(charactersAreSpecialIUPACPair('t', 'K', { GUT: true })).toBeTruthy();
    expect(charactersAreSpecialIUPACPair('k', 'K', { GUT: true })).toBeTruthy();

    // when set to false
    expect(charactersAreSpecialIUPACPair('G', 'K', { GUT: false })).toBeFalsy();
    expect(charactersAreSpecialIUPACPair('k', 'U', { GUT: false })).toBeFalsy();
    expect(charactersAreSpecialIUPACPair('t', 'K', { GUT: false })).toBeFalsy();
    expect(charactersAreSpecialIUPACPair('k', 'K', { GUT: false })).toBeFalsy();
  });
});
