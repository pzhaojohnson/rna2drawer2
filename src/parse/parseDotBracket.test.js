import parseDotBracket from './parseDotBracket';

it('only secondary pairings', () => {

  // empty
  expect(parseDotBracket('')).toEqual([]);

  // unstructured
  expect(
    parseDotBracket('....')
  ).toEqual([null, null, null, null]);

  // a hairpin
  expect(
    parseDotBracket('((((....))))')
  ).toEqual([12, 11, 10, 9, null, null, null, null, 4, 3, 2, 1]);

  // an internal loop
  expect(
    parseDotBracket('.(((..((...))))).')
  ).toEqual([null, 16, 15, 14, null, null, 13, 12, null, null, null, 8, 7, 4, 3, 2, null]);

  // a multibranch loop
  expect(
    parseDotBracket('((..(((..)))..((....)))).')
  ).toEqual([24, 23, null, null, 12, 11, 10, null, null, 7, 6, 5, null, null, 22, 21, null, null, null, null, 16, 15, 2, 1, null]);
});

it('tertiary pairings', () => {

  // a pseudoknot
  
  expect(
    parseDotBracket('((([[[)))]]]')
  ).toEqual([9, 8, 7, 12, 11, 10, 3, 2, 1, 6, 5, 4]);

  expect(
    parseDotBracket('((({{{)))}}}')
  ).toEqual([9, 8, 7, 12, 11, 10, 3, 2, 1, 6, 5, 4]);

  expect(
    parseDotBracket('(((<<<)))>>>')
  ).toEqual([9, 8, 7, 12, 11, 10, 3, 2, 1, 6, 5, 4]);

  // knotted pseudoknots

  expect(
    parseDotBracket('(((.[[[.))).{{{.]]].}}}.')
  ).toEqual([11, 10, 9, null, 19, 18, 17, null, 3, 2, 1, null, 23, 22, 21, null, 7, 6, 5, null, 15, 14, 13, null]);

  expect(
    parseDotBracket('(((.[[[.))).<<<.]]].>>>.')
  ).toEqual([11, 10, 9, null, 19, 18, 17, null, 3, 2, 1, null, 23, 22, 21, null, 7, 6, 5, null, 15, 14, 13, null]);

  expect(
    parseDotBracket('(((.<<<.))).{{{.>>>.}}}.')
  ).toEqual([11, 10, 9, null, 19, 18, 17, null, 3, 2, 1, null, 23, 22, 21, null, 7, 6, 5, null, 15, 14, 13, null]);
});

it('ignoreTertiaryPairings', () => {
  
  // a pseudoknot
  
  expect(
    parseDotBracket('((([[[)))]]]', true)
  ).toEqual([9, 8, 7, null, null, null, 3, 2, 1, null, null, null]);

  expect(
    parseDotBracket('((({{{)))}}}', true)
  ).toEqual([9, 8, 7, null, null, null, 3, 2, 1, null, null, null]);

  expect(
    parseDotBracket('(((<<<)))>>>', true)
  ).toEqual([9, 8, 7, null, null, null, 3, 2, 1, null, null, null]);

  // knotted pseudoknots

  expect(
    parseDotBracket('(((.[[[.))).{{{.]]].}}}.', true)
  ).toEqual([11, 10, 9, null, null, null, null, null, 3, 2, 1, null, null, null, null, null, null, null, null, null, null, null, null, null]);

  expect(
    parseDotBracket('(((.<<<.))).{{{.>>>.}}}.', true)
  ).toEqual([11, 10, 9, null, null, null, null, null, 3, 2, 1, null, null, null, null, null, null, null, null, null, null, null, null, null]);
});

it('unmatched partners', () => {

  // unmatched downstream partners

  expect(
    () => parseDotBracket('((((....)))))')
  ).toThrow();

  expect(
    () => parseDotBracket('((..(((..))))..((....)))).')
  ).toThrow();

  // unmatched upstream partners

  expect(
    () => parseDotBracket('(((((....))))')
  ).toThrow();

  expect(
    () => parseDotBracket('((..(((..)))..(((....)))).')
  ).toThrow();
});

it('ignore whitespace', () => {
  expect(
    parseDotBracket(' ((\t\t((. \n\r\t ..\t.))))')
  ).toEqual([12, 11, 10, 9, null, null, null, null, 4, 3, 2, 1]);

  expect(
    parseDotBracket('(((.  \t\t<<<\r\n  \r.))).{{{.\t\t>>>.}}}.')
  ).toEqual([11, 10, 9, null, 19, 18, 17, null, 3, 2, 1, null, 23, 22, 21, null, 7, 6, 5, null, 15, 14, 13, null]);
});

it('ignore non-dot-bracket characters', () => {
  expect(
    parseDotBracket('.  #$%^&(((.queyweytqi.((...kon!@#))))).')
  ).toEqual([null, 16, 15, 14, null, null, 13, 12, null, null, null, 8, 7, 4, 3, 2, null]);

  expect(
    parseDotBracket('(((.<<aa<.))weofk).{{{!@#$%.>>>.}}}.')
  ).toEqual([11, 10, 9, null, 19, 18, 17, null, 3, 2, 1, null, 23, 22, 21, null, 7, 6, 5, null, 15, 14, 13, null]);
});
