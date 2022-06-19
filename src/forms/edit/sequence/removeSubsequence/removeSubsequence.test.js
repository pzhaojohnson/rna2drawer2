import { App } from 'App';
import * as SVG from 'Draw/svg/NodeSVG';

import { appendSequence } from 'Draw/sequences/add/sequence';

import { updateBaseNumberings } from 'Draw/sequences/updateBaseNumberings';
import { numberingOffset } from 'Draw/sequences/numberingOffset';

import { removeSubsequence } from './removeSubsequence';

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
    { id: 'asdf', characters: 'ASDFqwerZXCV1234' },
  );

  args = {
    app,
    startPosition: '1',
    endPosition: '2',
  };
});

afterEach(() => {
  args = null;

  sequence = null;

  app.remove();
  app = null;

  container.remove();
  container = null;
});

describe('removeSubsequence function', () => {
  test('valid inputs', () => {
    expect(sequence.length).toBeGreaterThan(10);

    updateBaseNumberings(sequence, { offset: 98, anchor: 2, increment: 3 });
    expect(numberingOffset(sequence)).toBe(98); // test with a numbering offset

    let sequenceString = stringifySequence(sequence);
    args.startPosition = '101';
    args.endPosition = '104';
    removeSubsequence(args);
    sequenceString = sequenceString.substring(0, (101 - 98) - 1) + sequenceString.substring((105 - 98) - 1);
    expect(stringifySequence(sequence)).toBe(sequenceString);
  });

  test('blank start and end positions', () => {
    args.startPosition = ''; // empty
    args.endPosition = '3'; // valid
    expect(() => removeSubsequence(args)).toThrow();
    args.startPosition = '  \t  \n  '; // whitespace
    expect(() => removeSubsequence(args)).toThrow();

    args.startPosition = '2'; // valid
    args.endPosition = ''; // empty
    expect(() => removeSubsequence(args)).toThrow();
    args.endPosition = '  \n\n  \t '; // whitespace
    expect(() => removeSubsequence(args)).toThrow();

    args.startPosition = '2'; // valid
    args.endPosition = '3'; // valid
    expect(() => removeSubsequence(args)).not.toThrow();
  });

  test('nonnumeric start and end positions', () => {
    args.startPosition = 'asdf'; // nonnumeric
    args.endPosition = '5'; // valid
    expect(() => removeSubsequence(args)).toThrow();

    args.startPosition = '4'; // valid
    args.endPosition = 'zxcv'; // nonnumeric
    expect(() => removeSubsequence(args)).toThrow();

    args.startPosition = '4'; // valid
    args.endPosition = '5'; // valid
    expect(() => removeSubsequence(args)).not.toThrow();
  });

  test('non-integer start and end positions', () => {
    args.startPosition = '2.58'; // non-integer
    args.endPosition = '6'; // valid
    expect(() => removeSubsequence(args)).toThrow();

    args.startPosition = '2'; // valid
    args.endPosition = '5.98'; // non-integer
    expect(() => removeSubsequence(args)).toThrow();

    args.startPosition = '2'; // valid
    args.endPosition = '6'; // valid
    expect(() => removeSubsequence(args)).not.toThrow();
  });

  test('when start position is greater than end position', () => {
    args.startPosition = '7';
    args.endPosition = '3';
    expect(() => removeSubsequence(args)).toThrow();

    args.startPosition = '3'; // switch around
    args.endPosition = '7';
    expect(() => removeSubsequence(args)).not.toThrow();
  });

  test('out of range start and end positions', () => {
    expect(sequence.length).toBeGreaterThan(10);

    updateBaseNumberings(sequence, { offset: -23, anchor: -1, increment: 4 });
    expect(numberingOffset(sequence)).toBe(-23); // test with a numbering offset

    args.startPosition = '-23'; // just below range
    args.endPosition = '-19'; // in range
    expect(() => removeSubsequence(args)).toThrow();

    args.startPosition = '-19'; // in range
    args.endPosition = '-23'; // just below range
    expect(() => removeSubsequence(args)).toThrow();

    args.startPosition = '-17'; // in range
    args.endPosition = (sequence.length + (-23) + 1).toString(); // just above range
    expect(() => removeSubsequence(args)).toThrow();

    args.startPosition = (sequence.length + (-23) + 1).toString(); // just above range
    args.endPosition = '-17'; // in range
    expect(() => removeSubsequence(args)).toThrow();

    args.startPosition = '-22'; // at bottom of range
    args.endPosition = (sequence.length + (-23)).toString(); // at top of range
    expect(() => removeSubsequence(args)).not.toThrow();
  });

  test('when numbering offset is undefined', () => {
    expect(sequence.length).toBeGreaterThan(10);

    updateBaseNumberings(sequence, { offset: 5, anchor: 0, increment: 2 });
    sequence.bases[3].numbering.text.text('1000');
    expect(numberingOffset(sequence)).toBeUndefined();

    let sequenceString = stringifySequence(sequence);
    args.startPosition = '5';
    args.endPosition = '8';
    removeSubsequence(args);
    sequenceString = sequenceString.substring(0, 4) + sequenceString.substring(8);
    expect(stringifySequence(sequence)).toBe(sequenceString);
  });
});
