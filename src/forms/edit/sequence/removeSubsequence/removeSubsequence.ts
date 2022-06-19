import type { App } from 'App';

import type { Sequence } from 'Draw/sequences/Sequence';
import { numberingOffset } from 'Draw/sequences/numberingOffset';

import { isBlank } from 'Parse/isBlank';

// the underlying removeSubsequence function
import { removeSubsequence as _removeSubsequence } from 'Draw/strict/removeSubsequence';

export type Args = {
  /**
   * A reference to the whole app.
   */
  app: App;

  /**
   * Raw input from the user for the start position
   * of the subsequence to remove.
   */
  startPosition: string;

  /**
   * Raw input from the user for the end position
   * of the subsequence to remove.
   */
  endPosition: string;
};

/**
 * Removes the specified subsequence from the first sequence in the drawing.
 * (This function expects the drawing to have exactly one sequence.)
 */
export function removeSubsequence(args: Args): void | never {
  if (isBlank(args.startPosition)) {
    throw new Error('Specify a start position.');
  } else if (isBlank(args.endPosition)) {
    throw new Error('Specify an end position.');
  }

  let startPosition = Number.parseFloat(args.startPosition);
  let endPosition = Number.parseFloat(args.endPosition);

  if (!Number.isFinite(startPosition)) {
    throw new Error('Start position must be a number.');
  } else if (!Number.isFinite(endPosition)) {
    throw new Error('End position must be a number.');
  }

  if (!Number.isInteger(startPosition)) {
    throw new Error('Start position must be an integer.');
  } else if (!Number.isInteger(endPosition)) {
    throw new Error('End position must be an integer.');
  }

  if (startPosition > endPosition) {
    throw new Error('Start position is greater than end position.');
  }

  let sequence: Sequence | undefined = args.app.drawing.sequences[0];

  if (!sequence) {
    throw new Error('Drawing has no sequences.');
  } else if (args.app.drawing.sequences.length > 1) {
    console.error('Drawing has multiple sequences.');
  }

  let no = numberingOffset(sequence) ?? 0;
  startPosition -= no;
  endPosition -= no;

  if (startPosition < 1 || startPosition > sequence.length) {
    throw new Error('Start position is out of range.');
  } else if (endPosition < 1 || endPosition > sequence.length) {
    throw new Error('End position is out of range.');
  }

  args.app.pushUndo();

  _removeSubsequence(
    args.app.strictDrawing,
    {
      parent: sequence,
      start: startPosition,
      end: endPosition,
    },
  );

  args.app.refresh();
}
