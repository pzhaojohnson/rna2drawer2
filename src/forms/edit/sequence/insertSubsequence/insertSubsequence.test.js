import { App } from 'App';
import * as SVG from 'Draw/svg/NodeSVG';

import { appendSequence } from 'Draw/sequences/add/sequence';
import { updateBaseNumberings } from 'Draw/sequences/updateBaseNumberings';
import { numberingOffset } from 'Draw/sequences/numberingOffset';

import { insertSubsequence } from './insertSubsequence';

function stringifySequence(sequence) {
  return sequence.bases.map(b => b.text.text()).join('');
}

let container = null;
let app = null;
let sequence = null;

let args = null;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);

  app = new App({ SVG });
  app.appendTo(container);

  sequence = appendSequence(
    app.strictDrawing.drawing,
    { id: 'asdf', characters: 'asdfASDFqwerQWER' },
  );

  args = {
    app,

    subsequence: 'AUGCT',
    ignoreNumbers: true,
    ignoreNonAUGCTLetters: false,
    ignoreNonAlphanumerics: true,

    positionToInsertAt: '3',

    includeSubstructure: false,
    substructure: '.....',
  };
});

afterEach(() => {
  sequence = null;

  app.remove();
  app = null;

  container.remove();
  container = null;
});

describe('insertSubsequence function', () => {
  test('a blank subsequence', () => {
    args.subsequence = 'AAA';
    expect(() => insertSubsequence(args)).not.toThrow();
    args.subsequence = ''; // empty
    expect(() => insertSubsequence(args)).toThrow();
    args.subsequence = '  \t\t   \n\n   '; // whitespace
    expect(() => insertSubsequence(args)).toThrow();
  });

  test('a subsequence with only ignored characters', () => {
    args.subsequence = '1234';
    args.ignoreNumbers = false;
    expect(() => insertSubsequence(args)).not.toThrow();
    args.ignoreNumbers = true;
    expect(() => insertSubsequence(args)).toThrow();
  });

  test('ignoreNumbers option', () => {
    args.subsequence = '14892';
    let sequenceLength = sequence.length;

    args.ignoreNumbers = true;
    expect(() => insertSubsequence(args)).toThrow();

    args.ignoreNumbers = false;
    insertSubsequence(args);
    expect(sequence.length).toBe(sequenceLength + 5);
  });

  test('ignoreNonAUGCTLetters option', () => {
    args.subsequence = 'QwEB';
    let sequenceLength = sequence.length;

    args.ignoreNonAUGCTLetters = true;
    expect(() => insertSubsequence(args)).toThrow();

    args.ignoreNonAUGCTLetters = false;
    insertSubsequence(args);
    expect(sequence.length).toBe(sequenceLength + 4);
  });

  test('ignoreNonAlphanumerics option', () => {
    args.subsequence = '.,;/-+';
    let sequenceLength = sequence.length;

    args.ignoreNonAlphanumerics = true;
    expect(() => insertSubsequence(args)).toThrow();

    args.ignoreNonAlphanumerics = false;
    insertSubsequence(args);
    expect(sequence.length).toBe(sequenceLength + 6);
  });

  test('a blank positionToInsertAt', () => {
    args.positionToInsertAt = '1';
    expect(() => insertSubsequence(args)).not.toThrow();
    args.positionToInsertAt = ''; // empty
    expect(() => insertSubsequence(args)).toThrow();
    args.positionToInsertAt = '  \t \n '; // whitespace
    expect(() => insertSubsequence(args)).toThrow();
  });

  test('a nonnumeric positionToInsertAt', () => {
    args.positionToInsertAt = '3';
    expect(() => insertSubsequence(args)).not.toThrow();
    args.positionToInsertAt = 'asdf';
    expect(() => insertSubsequence(args)).toThrow();
  });

  test('a non-integer positionToInsertAt', () => {
    args.positionToInsertAt = '8';
    expect(() => insertSubsequence(args)).not.toThrow();
    args.positionToInsertAt = '8.456';
    expect(() => insertSubsequence(args)).toThrow();
  });

  test('inserting at the beginning', () => {
    updateBaseNumberings(sequence, { offset: -12, increment: 3, anchor: -2 });
    expect(numberingOffset(sequence)).toBe(-12); // test with a numbering offset

    let sequenceString = stringifySequence(sequence);
    args.subsequence = 'CCTT';
    args.positionToInsertAt = '-11';
    insertSubsequence(args);
    sequenceString = 'CCTT' + sequenceString;
    expect(stringifySequence(sequence)).toBe(sequenceString);
  });

  test('inserting in the middle', () => {
    updateBaseNumberings(sequence, { offset: 23, increment: 2, anchor: 1 });
    expect(numberingOffset(sequence)).toBe(23); // test with a numbering offset

    expect(sequence.length).toBeGreaterThan(10);
    let sequenceString = stringifySequence(sequence);
    args.subsequence = 'gg';
    args.positionToInsertAt = '30';
    insertSubsequence(args);
    sequenceString = sequenceString.substring(0, 6) + 'gg' + sequenceString.substring(6);
    expect(stringifySequence(sequence)).toBe(sequenceString);
  });

  test('appending to the end', () => {
    updateBaseNumberings(sequence, { offset: 9, increment: 4, anchor: -25 });
    expect(numberingOffset(sequence)).toBe(9); // test with a numbering offset

    let sequenceString = stringifySequence(sequence);
    args.subsequence = 'aaAAtu';
    args.positionToInsertAt = (sequence.length + 9 + 1).toString(); // a position
    insertSubsequence(args);
    sequenceString += 'aaAAtu';
    expect(stringifySequence(sequence)).toBe(sequenceString);

    args.subsequence = 'TTuuCA';
    args.positionToInsertAt = 'append'; // the string "append"
    insertSubsequence(args);
    sequenceString += 'TTuuCA';
    expect(stringifySequence(sequence)).toBe(sequenceString);
  });

  test('trying to insert just below bounds', () => {
    updateBaseNumberings(sequence, { offset: 4, increment: 3, anchor: 2 });
    expect(numberingOffset(sequence)).toBe(4); // test with a numbering offset

    args.positionToInsertAt = '5';
    expect(() => insertSubsequence(args)).not.toThrow();
    args.positionToInsertAt = '4';
    expect(() => insertSubsequence(args)).toThrow();
  });

  test('trying to insert just above bounds', () => {
    updateBaseNumberings(sequence, { offset: 52, increment: 5, anchor: -11 });
    expect(numberingOffset(sequence)).toBe(52); // test with a numbering offset

    args.positionToInsertAt = (sequence.length + 52 + 1).toString();
    expect(() => insertSubsequence(args)).not.toThrow();
    args.positionToInsertAt = (sequence.length + 52 + 2).toString();
    expect(() => insertSubsequence(args)).toThrow();
  });

  test('including a substructure', () => {
    args.subsequence = 'AAAAAAAAAAAA';
    args.positionToInsertAt = '3';
    args.includeSubstructure = true;
    args.substructure = '.(.{..).}.';
    insertSubsequence(args);

    // adds secondary bonds
    let secondaryBonds = app.drawing.secondaryBonds;
    let b4 = sequence.atPosition(4);
    let b9 = sequence.atPosition(9);
    expect(secondaryBonds.find(sb => sb.binds(b4) && sb.binds(b9))).toBeTruthy();

    // adds tertiary bonds
    let tertiaryBonds = app.drawing.tertiaryBonds;
    let b6 = sequence.atPosition(6);
    let b11 = sequence.atPosition(11);
    expect(tertiaryBonds.find(tb => tb.binds(b6) && tb.binds(b11))).toBeTruthy();
  });

  test('a blank substructure', () => {
    args.includeSubstructure = true;
    args.substructure = '...'; // not blank
    expect(() => insertSubsequence(args)).not.toThrow();

    args.includeSubstructure = true;
    args.substructure = ''; // empty
    expect(() => insertSubsequence(args)).toThrow();
    args.includeSubstructure = false; // should no longer throw
    expect(() => insertSubsequence(args)).not.toThrow();

    args.includeSubstructure = true;
    args.substructure = '  \t\n\n\t  '; // whitespace
    expect(() => insertSubsequence(args)).toThrow();
    args.includeSubstructure = false; // should no longer throw
    expect(() => insertSubsequence(args)).not.toThrow();
  });

  test('an invalid substructure', () => {
    args.includeSubstructure = true;
    args.substructure = '....'; // valid
    expect(() => insertSubsequence(args)).not.toThrow();
    args.substructure = '.(..'; // unmatched "("
    expect(() => insertSubsequence(args)).toThrow();
    args.includeSubstructure = false; // should no longer throw
    expect(() => insertSubsequence(args)).not.toThrow();
  });

  test('a substructure longer than the subsequence', () => {
    args.subsequence = 'AAA';
    args.includeSubstructure = true;
    args.substructure = '......'; // longer than subsequence
    expect(() => insertSubsequence(args)).toThrow();
    args.includeSubstructure = false; // should no longer throw
    expect(() => insertSubsequence(args)).not.toThrow();
    args.includeSubstructure = true;
    args.subsequence = 'AAAAAAAAAAAA'; // longer than substructure
    expect(() => insertSubsequence(args)).not.toThrow();
  });
});
