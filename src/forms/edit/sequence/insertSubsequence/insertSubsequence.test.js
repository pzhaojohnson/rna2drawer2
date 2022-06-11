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

  test('a nonzero sequence numbering offset', () => {
    updateBaseNumberings(sequence, { offset: -8, increment: 3, anchor: -2 });
    expect(numberingOffset(sequence)).toBe(-8);

    let sequenceString = stringifySequence(sequence);
    args.subsequence = 'AUG';
    args.positionToInsertAt = '-3';
    insertSubsequence(args);
    sequenceString = sequenceString.substring(0, 4) + 'AUG' + sequenceString.substring(4);
    expect(stringifySequence(sequence)).toBe(sequenceString);
  });

  test('inserting at the beginning', () => {
    let sequenceString = stringifySequence(sequence);
    args.subsequence = 'CCTT';
    args.positionToInsertAt = '1';
    insertSubsequence(args);
    sequenceString = 'CCTT' + sequenceString;
    expect(stringifySequence(sequence)).toBe(sequenceString);
  });

  test('inserting in the middle', () => {
    expect(sequence.length).toBeGreaterThan(10);
    let sequenceString = stringifySequence(sequence);
    args.subsequence = 'gg';
    args.positionToInsertAt = '7';
    insertSubsequence(args);
    sequenceString = sequenceString.substring(0, 6) + 'gg' + sequenceString.substring(6);
    expect(stringifySequence(sequence)).toBe(sequenceString);
  });

  test('appending to the end', () => {
    let sequenceString = stringifySequence(sequence);
    args.subsequence = 'aaAAtu';
    args.positionToInsertAt = (sequence.length + 1).toString();
    insertSubsequence(args);
    sequenceString += 'aaAAtu';
    expect(stringifySequence(sequence)).toBe(sequenceString);
  });

  test('trying to insert just below bounds', () => {
    args.positionToInsertAt = '1';
    expect(() => insertSubsequence(args)).not.toThrow();
    args.positionToInsertAt = '0';
    expect(() => insertSubsequence(args)).toThrow();
  });

  test('trying to insert just above bounds', () => {
    args.positionToInsertAt = (sequence.length + 1).toString();
    expect(() => insertSubsequence(args)).not.toThrow();
    args.positionToInsertAt = (sequence.length + 2).toString();
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
