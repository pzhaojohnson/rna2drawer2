import { charactersMatch } from './charactersMatch';

describe('charactersMatch function', () => {
  it('matches same characters', () => {
    // same characters
    expect(charactersMatch('a', 'a')).toBeTruthy();
    expect(charactersMatch('G', 'G')).toBeTruthy();
    expect(charactersMatch('d', 'd')).toBeTruthy();

    // different characters
    expect(charactersMatch('e', 'f')).toBeFalsy();
    expect(charactersMatch('B', 'M')).toBeFalsy();
    expect(charactersMatch('q', '1')).toBeFalsy();
  });

  it('is not case-sensitive', () => {
    expect(charactersMatch('t', 'T')).toBeTruthy();
    expect(charactersMatch('C', 'c')).toBeTruthy();
  });

  test('UT option', () => {
    // when set to true
    expect(charactersMatch('u', 't', { UT: true })).toBeTruthy();
    expect(charactersMatch('t', 'u', { UT: true })).toBeTruthy(); // switch order

    // when set to false
    expect(charactersMatch('u', 't', { UT: false })).toBeFalsy();
    expect(charactersMatch('t', 'u', { UT: false })).toBeFalsy(); // switch order

    // when left unspecified
    expect(charactersMatch('u', 't')).toBeFalsy();
  });

  test('IUPAC option', () => {
    // when set to true
    expect(charactersMatch('R', 'a', { IUPAC: true })).toBeTruthy();
    expect(charactersMatch('C', 'y', { IUPAC: true })).toBeTruthy();
    expect(charactersMatch('k', 'g', { IUPAC: true })).toBeTruthy();
    // N should match anything
    expect(charactersMatch('z', 'N', { IUPAC: true })).toBeTruthy();
    expect(charactersMatch('n', '1', { IUPAC: true })).toBeTruthy();

    // when set to false
    expect(charactersMatch('R', 'a', { IUPAC: false })).toBeFalsy();
    expect(charactersMatch('C', 'y', { IUPAC: false })).toBeFalsy();
    expect(charactersMatch('k', 'g', { IUPAC: false })).toBeFalsy();
    expect(charactersMatch('z', 'N', { IUPAC: false })).toBeFalsy();
    expect(charactersMatch('n', '1', { IUPAC: false })).toBeFalsy();

    // when left unspecified
    expect(charactersMatch('M', 'N')).toBeFalsy();
  });
});
