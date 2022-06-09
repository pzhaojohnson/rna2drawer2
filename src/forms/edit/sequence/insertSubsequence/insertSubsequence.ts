import type { App } from 'App';

import type { Sequence } from 'Draw/sequences/Sequence';
import { numberingOffset } from 'Draw/sequences/numberingOffset';

import { isBlank } from 'Parse/isBlank';
import { parseSequence } from 'Parse/parseSequence';

// the underlying insertSubsequence function
import { insertSubsequence as _insertSubsequence } from 'Draw/strict/insertSubsequence';

export type Args = {
  app: App; // a reference to the whole app

  // raw input from the user for the subsequence to insert
  subsequence: string;

  // options for parsing the subsequence input
  ignoreNumbers: boolean;
  ignoreNonAUGCTLetters: boolean;
  ignoreNonAlphanumerics: boolean;

  // position to insert the subsequence at (given as a string)
  // (bases for the subsequence will be inserted beginning at this position)
  positionToInsertAt: string;
};

/**
 * Inserts the given subsequence into the first sequence in the drawing of the app.
 * (This function expects the drawing to have exactly one sequence.)
 *
 * When the position to insert at is set to the sequence length plus one,
 * the provided subsequence is appended to the end of the sequence.
 */
export function insertSubsequence(args: Args): void | never {
  let strictDrawing = args.app.strictDrawing;
  let sequence: Sequence | undefined = strictDrawing.sequences[0];

  if (!sequence) {
    throw new Error('Drawing has no sequences.');
  } else if (strictDrawing.sequences.length > 1) {
    console.error('Drawing has multiple sequences.');
    console.error('Inserting subsequence into the first sequence.');
  }

  let ignoreNumbers = args.ignoreNumbers;
  let ignoreNonAUGCTLetters = args.ignoreNonAUGCTLetters;
  let ignoreNonAlphanumerics = args.ignoreNonAlphanumerics;

  let subsequence = parseSequence(
    args.subsequence,
    { ignoreNumbers, ignoreNonAUGCTLetters, ignoreNonAlphanumerics },
  );

  if (isBlank(args.subsequence)) {
    throw new Error('Subsequence is empty.');
  } else if (isBlank(subsequence)) {
    throw new Error('Subsequence has only ignored characters.');
  }

  let positionToInsertAt = Number.parseFloat(args.positionToInsertAt);

  if (isBlank(args.positionToInsertAt)) {
    throw new Error('Specify position to insert at.');
  } else if (!Number.isFinite(positionToInsertAt)) {
    throw new Error('Position to insert at must be a number.');
  } else if (!Number.isInteger(positionToInsertAt)) {
    throw new Error('Position to insert at must be an integer.');
  }

  let no = numberingOffset(sequence) ?? 0;
  positionToInsertAt -= no;

  if (positionToInsertAt < 1 || positionToInsertAt > sequence.length + 1) {
    throw new Error('Position to insert at is out of bounds.');
  }

  args.app.pushUndo();

  _insertSubsequence(strictDrawing, {
    parent: sequence,
    characters: subsequence,
    start: positionToInsertAt,
  });

  args.app.refresh();
}
